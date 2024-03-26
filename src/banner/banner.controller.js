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
  })

  return res.status(201).json(respondSuccess(doc));
}

exports.getBanners = async (req, res, next) => {
  const banners = await BannerModel.find();
  res.json(respondSuccess(banners));
}

exports.deleteBanner = async (req, res, next) => {
  await BannerModel.findByIdAndDelete(req.params.bannerId);
  res.status(204).end();
}