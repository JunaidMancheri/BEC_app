const {BadRequest} = require('http-errors');
const {BannerModel} = require('./banner.model');
const {generateFilename} = require('../common/upload.helper');
const {respondSuccess} = require('../common/response.helper');
const fs = require('fs');
const {join} = require('path');
const {appConfig} = require('../config/app.config');
const { cloudinary, isCloudinaryUrl, getPublicId } = require('../common/cloudinary.service');
const { extractFilePathFromUrl } = require('../common/utils');

exports.createBanner = async (req, res, next) => {
  if (!req.file) throw new BadRequest('image is required');

  const filename = generateFilename(req.file.mimetype);
  const fileUrl = join(appConfig.APP_BASE_URL, 'uploads', 'banners', filename);
  const filePath = join('public', fileUrl);
  await fs.promises.writeFile(filePath, req.file.buffer);

  const doc = await BannerModel.create({
    description: req.body.description,
    title: req.body.title,
    link: req.body.link,
    imageUrl: fileUrl,
    isActive: true,
  });

  res.status(201).json(respondSuccess(doc));
  

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

exports.getBanners = async (req, res, next) => {
  // isActive based on admin and users;
  const banners = await BannerModel.find();
  res.json(respondSuccess(banners));
};

exports.deleteBanner = async (req, res, next) => {
  const doc = await BannerModel.findByIdAndDelete(req.params.bannerId);
  res.status(204).end();
  if (isCloudinaryUrl(doc.imageUrl)) {
    cloudinary.uploader.destroy(getPublicId(doc.imageUrl)).catch(() => {});
  } else {
    fs.promises.unlink(extractFilePathFromUrl(doc.imageUrl)).catch(() => {});
  }
};

exports.toggleBannerStatus = async (req, res, next) => {
  const doc = await BannerModel.findById(req.params.bannerId);
  doc.isActive = !doc.isActive;
  await doc.save();
  res.status(204).end();
};

exports.updateBanner = async (req, res) => {
  if (!req.file && Object.keys(req.body).length === 0) {
    return res.status(204).end();
  }

  const doc = await BannerModel.findById(req.params.bannerId);
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
    const url = `${appConfig.APP_BASE_URL}/uploads/banners/${generateFilename(req.file.mimetype)}`;
    filePath = join('public', url);
    await fs.promises.writeFile(filePath, req.file.buffer);
    doc.imageUrl = url;
  }
  
  await doc.save();
  res.json(respondSuccess(doc));
  
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
