const {BadRequest, NotFound} = require('http-errors');
const {BannerModel} = require('./banner.model');
const {generateFilename} = require('../common/upload.helper');
const {respondSuccess} = require('../common/response.helper');
const fs = require('fs');
const {join} = require('path');
const {appConfig} = require('../config/app.config');
const { cloudinary, isCloudinaryUrl, getPublicId } = require('../common/cloudinary.service');
const { extractFilePathFromUrl } = require('../common/utils');
const { makeLogger } = require('../common/logger.config');

const Logger = makeLogger('Banner');

exports.createBanner = async (req, res, next) => {
  if (!req.file) throw new BadRequest('image is required');

  const filename = generateFilename(req.file.mimetype);
  const filePath = join('public', 'uploads', 'banners', filename);
  await fs.promises.writeFile(filePath, req.file.buffer);

  const doc = await BannerModel.create({
    description: req.body.description,
    title: req.body.title,
    link: req.body.link,
    imageUrl: `${appConfig.APP_BASE_URL}/uploads/banners/${filename}`,
    isActive: true,
  });


  Logger.info('created ' + doc._id);
  res.status(201).json(respondSuccess(doc));
  

  cloudinary.uploader.upload(filePath, async (err, info) => {
    try {
      if (err) return;
      doc.imageUrl = info.url;
      await doc.save();
      fs.promises.unlink(filePath).catch(() => {});
      Logger.info('Upload banner to cloudinary ' + doc._id)
    } catch (error) {
      cloudinary.uploader.destroy(info.public_id).catch(() => {});
    }
  });

};

exports.getBanners = async (req, res, next) => {
  let filter = {isActive : true};
  if (req.user?.isAdmin) {
    filter = {};
  }
  const banners = await BannerModel.find(filter);
  res.json(respondSuccess(banners));
};

exports.deleteBanner = async (req, res, next) => {
  const doc = await BannerModel.findByIdAndDelete(req.params.bannerId);
  Logger.info('deleted ' + doc._id);
  res.status(204).end();
  if (isCloudinaryUrl(doc.imageUrl)) {
    cloudinary.uploader.destroy(getPublicId(doc.imageUrl)).catch(() => {});
    Logger.info('removed old banner image from cloudinary ' + doc._id);
  } else {
    fs.promises.unlink(extractFilePathFromUrl(doc.imageUrl)).catch(() => {});
    Logger.info('removed old banner image from disk ' + doc._id);
  }
};

exports.toggleBannerStatus = async (req, res, next) => {
  const doc = await BannerModel.findById(req.params.bannerId);
  doc.isActive = !doc.isActive;
  await doc.save();
  Logger.info('status changed to  ' + doc.isActive + ' ' + doc._id );
  res.json(respondSuccess(doc)).end();
};

exports.updateBanner = async (req, res) => {
  if (!req.file && Object.keys(req.body).length === 0) {
    return res.status(204).end();
  }

  const doc = await BannerModel.findById(req.params.bannerId);
  if (!doc) throw new NotFound('Banner not  found');
  if (req.body.title) {
    doc.title = req.body.title;
  }

  if (req.body.description) {
    doc.description = req.body.description;
  }

  if (req.body.link) {
    doc.link = req.body.link;
  }
  let filePath;
  let oldfileUrl = doc.imageUrl;
  if (req.file) {
    const filename = generateFilename(req.file.mimetype);
    filePath = join('public', 'uploads', 'banners', filename);
    await fs.promises.writeFile(filePath, req.file.buffer);
    doc.imageUrl = `${appConfig.APP_BASE_URL}/uploads/banners/${filename}`;
  }

  await doc.save();

  Logger.info('updated ' + doc._id);
  res.json(respondSuccess(doc));
  
  if (req.file) {
    cloudinary.uploader.upload(filePath, async (err, info) => {
      try {
        if (err) return;
        doc.imageUrl = info.url;
        await doc.save();
        fs.promises.unlink(filePath).catch(() => {});
        Logger.info('uploaded updated banner image to cloudinary ' + doc._id);
        if (isCloudinaryUrl(oldfileUrl)) {
          cloudinary.uploader.destroy(getPublicId(oldfileUrl)).catch(() => {});
          Logger.info('removed old banner image from cloudinary ' + doc._id);
        } else {
          fs.promises
            .unlink(extractFilePathFromUrl(oldfileUrl))
            .catch(err => {});
            Logger.info('removed old banner image from disk ' + doc._id);
        }
      } catch (error) {
        cloudinary.uploader.destroy(info.public_id).catch(() => {});
      }
    });
  }
};
