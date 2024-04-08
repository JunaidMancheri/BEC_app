const {respondSuccess} = require('../common/response.helper');
const {generateFilename} = require('../common/upload.helper');
const {generateSlug} = require('../common/slug.helper');
const {Conflict, BadRequest, NotFound} = require('http-errors');
const {join} = require('path');
const fs = require('fs');
const {amenityModel} = require('./amenity.model');
const {EventEmitter} = require('../common/EventEmitter');
const {appConfig} = require('../config/app.config');
const {
  cloudinary,
  isCloudinaryUrl,
  getPublicId,
} = require('../common/cloudinary.service');
const {extractFilePathFromUrl} = require('../common/utils');
const {makeLogger} = require('../common/logger.config');

const Logger = makeLogger('Amenity');

/**
 * @type {import("../..").ExpressController}
 */
exports.createAmenity = async (req, res, next) => {
  if (!req.file) throw new BadRequest('image is required');

  const filename = generateFilename(req.file.mimetype);
  let doc;
  try {
    doc = await amenityModel.create({
      nameSlug: generateSlug(req.body.name),
      name: req.body.name,
      imageUrl: `${appConfig.APP_BASE_URL}/uploads/amenities/${filename}`,
    });
  } catch (error) {
    if (error.code === 11000) throw new Conflict('Amenity already exists');
    throw error;
  }

  const filePath = join('public', 'uploads', 'amenities', filename);
  await fs.promises.writeFile(filePath, req.file.buffer);

  Logger.info('created ' + doc.name);

  res.json(respondSuccess(doc)).end();

  cloudinary.uploader.upload(filePath, async (err, info) => {
    try {
      if (err) return;
      doc.imageUrl = info.url;
      await doc.save();
      fs.promises.unlink(filePath).catch(() => {});
    } catch (error) {
      cloudinary.uploader.destroy(info.public_id).catch(() => {});
    }
  });
};

exports.getAmenities = async (req, res) => {
  const amenities = await amenityModel.find({}, '-nameSlug');
  return res.json(respondSuccess(amenities));
};

exports.updateAmenity = async (req, res) => {
  if (!req.body.name && !req.file) {
    return res.status(204).end();
  }
  const doc = await amenityModel.findById(req.params.amenityId);
  if (!doc) throw new NotFound('Amenity not found');
  if (req.body.name) {
    doc.name = req.body.name;
    doc.nameSlug = generateSlug(req.body.name);
  }
  let oldfileUrl = doc.imageUrl;
  let filename;
  let filePath;
  if (req.file) {
    filename = generateFilename(req.file.mimetype);
    doc.imageUrl = `${appConfig.APP_BASE_URL}/uploads/amenities/${filename}`;
    filePath = join('public', 'uploads', 'amenities', filename);
  }

  try {
    const response = await doc.save({new: true});
    if (req.file) {
      await fs.promises.writeFile(filePath, req.file.buffer);
    }  

    Logger.info('Updated ' + doc._id);

    res.json(respondSuccess(response)).end();
  } catch (error) {
    if (error.code === 11000) {
      throw new Conflict('Amenity is already in use');
    }
    throw error;
  }

  if (req.file) {
    cloudinary.uploader.upload(filePath, async (err, info) => {
      try {
        if (err) return;
        doc.imageUrl = info.url;
        await doc.save();
        fs.promises.unlink(filePath).catch(() => {});
        if (isCloudinaryUrl(oldfileUrl)) {
          cloudinary.uploader.destroy(getPublicId(oldfileUrl)).catch(() => {});
        } else {
          fs.promises
            .unlink(extractFilePathFromUrl(oldfileUrl))
            .catch(err => {});
        }
      } catch (error) {
        cloudinary.uploader.destroy(info.public_id).catch(() => {});
      }
    });
  }
};

exports.deleteAmenity = async (req, res, next) => {
  const doc = await amenityModel.findByIdAndDelete(req.params.amenityId);
   
  Logger.info('Deleted ' + doc._id);
  res.status(204).end();

  EventEmitter.emit('Amenity:Deleted', {amenityId: req.params.amenityId});
  if (isCloudinaryUrl(doc.imageUrl)) {
    cloudinary.uploader.destroy(getPublicId(doc.imageUrl)).catch(() => {});
  } else {
    fs.promises.unlink(extractFilePathFromUrl(doc.imageUrl)).catch(() => {});
  }
};
