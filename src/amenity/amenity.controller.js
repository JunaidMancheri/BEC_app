const {respondSuccess} = require('../common/response.helper');
const {generateFilename} = require('../common/upload.helper');
const {generateSlug} = require('../common/slug.helper');
const {Conflict, BadRequest} = require('http-errors');
const {join} = require('path');
const fs = require('fs');
const {amenityModel} = require('./amenity.model');
const {EventEmitter} = require('../common/EventEmitter');

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
      imageUrl: `/uploads/amenities/${filename}`,
    });
  } catch (error) {
    if (error.code === 11000) throw new Conflict('Amenity already exists');
  }

  await fs.promises.writeFile(
    join('public', 'uploads', 'amenities', filename),
    req.file.buffer
  );

  return res.json(respondSuccess(doc));
};

exports.getAmenities = async (req, res) => {
  const amenities = await amenityModel.find({}, '-nameSlug');
  return res.json(respondSuccess(amenities));
};

exports.updateAmenity = async (req, res) => {
  if (req.body.name || req.file) {
    const doc = await amenityModel.findById(req.params.amenityId);
    if (req.body.name) {
      doc.name = req.body.name;
      doc.nameSlug = generateSlug(req.body.name);
    }
    let oldfile = doc.imageUrl.split('/')[3];
    let filename;
    if (req.file) {
      filename = generateFilename(req.file.mimetype);
      doc.imageUrl = `/uploads/amenities/${filename}`;
    }

    try {
      const response = await doc.save({new: true});
      if (req.file) {
        await fs.promises.unlink(
          join('public', 'uploads', 'amenities', oldfile)
        );
        await fs.promises.writeFile(
          join('public', 'uploads', 'amenities', filename),
          req.file.buffer
        );
      }

      return res.json(respondSuccess(response));
    } catch (error) {
      if (error.code === 11000) {
        throw new Conflict('Amenity is already in use');
      }
      throw error;
    }
  }

  return res.status(204).end();
};

exports.deleteAmenity = async (req, res, next) => {
  await amenityModel.findByIdAndDelete(req.params.amenityId);
  EventEmitter.emit('Amenity:Deleted', {amenityId: req.params.amenityId});
  res.status(204).end();
};
