const {BadRequest} = require('http-errors');
const { BannerModel } = require('./banner.model');
const { generateFilename } = require('../common/upload.helper');
const {respondSuccess} = require('../common/response.helper');
const fs = require('fs');
const { join } = require('path');

exports.createBanner = async (req, res, next) => {
  if (!req.file) throw new BadRequest('image is required');

  const filename = generateFilename(req.file.mimetype);
  const fileUrl = join('uploads', 'banners', filename);
  await fs.promises.writeFile(join('public', fileUrl), req.file.buffer);

  const doc = await BannerModel.create({
    description: req.body.description,
    title: req.body.title,
    link: req.body.link,
    imageUrl:  fileUrl,
    isActive: true,
  })

  return res.status(201).json(respondSuccess(doc));
}

exports.getBanners = async (req, res, next) => {
  // isActive based on admin and users;
  const banners = await BannerModel.find();
  res.json(respondSuccess(banners));
}

exports.deleteBanner = async (req, res, next) => {
  await BannerModel.findByIdAndDelete(req.params.bannerId);
  res.status(204).end();
}

exports.toggleBannerStatus = async (req, res, next) => {
  const doc = await BannerModel.findById(req.params.bannerId);
  doc.isActive = !doc.isActive
  await doc.save();
  res.status(204).end();
}


exports.updateBanner = async (req, res) => {
  if (!req.file && Object.keys(req.body).length === 0) {
    return res.status(204).end();
  }

  const doc = await BannerModel.findById(req.params.bannerId);
  if (req.body.title) {
    doc.title = req.body.title
  }

  if (req.body.description) {
    doc.description = req.body.description
  }

  if  (req.body.link) {
    doc.link = req.body.link
  }

  if (req.file) {
    const url = `/uploads/banners/${generateFilename(req.file.mimetype)}`;
    await fs.promises.writeFile(join('public', url), req.file.buffer);
    fs.promises.unlink(join('public', doc.imageUrl));
    doc.imageUrl = url;
  }

  await doc.save();

  res.json(respondSuccess(doc));
}