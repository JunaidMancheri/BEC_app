const {BadRequest} = require('http-errors');
const {PostModel} = require('./post.model');
const {getCategoryStatus} = require('../category');
const {
  generateFilename,
  generatePdfFilename,
} = require('../common/upload.helper');
const fs = require('fs');
const {join} = require('path');
const {respondSuccess} = require('../common/response.helper');

/**
 * @type {import("../..").ExpressController}
 */
exports.createPost = async (req, res, next) => {
  if (!req.files) throw new BadRequest('Images are required');
  if (!req.files['coverImage']) throw new BadRequest('coverImage is required');
  if (!req.files['gallery'])
    throw new BadRequest('gallery images are required');
  if (req.files['gallery'].length > 4)
    throw new BadRequest('gallery images can be only upto 4 images');

  let pdfFilename;
  if (req.files['pdfFile']) {
    pdfFilename = generatePdfFilename();
    fs.promises.writeFile(
      join('public', 'uploads', 'pdf', pdfFilename),
      req.files['pdfFile'][0].buffer
    );
  }

  const coverImageName = generateFilename(req.files['coverImage'][0].mimetype);
  fs.promises.writeFile(
    join('public', 'uploads', 'posts', coverImageName),
    req.files['coverImage'][0].buffer
  );

  const gallery = [];
  req.files['gallery'].forEach(file => {
    const filename = generateFilename(file.mimetype);
    fs.promises.writeFile(join('public', 'uploads', 'posts', filename), file.buffer);
    gallery.push(`/uploads/posts/${filename}`);
  });

  const doc = await PostModel.create({
    gallery,
    isActive: true,
    title: req.body['title'],
    category: req.body['category'],
    amenities: req.body['amenities'],
    description: req.body['description'],
    contactNumber: req.body['contactNumber'],
    coverImageUrl: `/uploads/posts/${coverImageName}`,
    isCategoryActive: await getCategoryStatus(req.body['category']),
    pdfFileUrl: pdfFilename ? `/uploads/pdf/${pdfFilename}` : undefined,
  });

  res.status(201).json(respondSuccess(doc));
};
