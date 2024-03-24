const {respondSuccess} = require('../common/response.helper');
const {generateFilename} = require('../common/upload.helper');
const {generateSlug} = require('../common/slug.helper');
const {categoryModel} = require('./category.model');
const {Conflict, BadRequest} = require('http-errors');
const {join} = require('path');
const fs = require('fs');
/**
 * @type {import("../..").ExpressController}
 */
exports.createCategoryController = async (req, res, next) => {
  if (!req.file) throw new BadRequest('image is required');

  const filename = generateFilename(req.file.mimetype);
  let doc;
  try {
    doc = await categoryModel.create({
      nameSlug: generateSlug(req.body.name),
      name: req.body.name,
      isActive: true,
      imageUrl: `/uploads/categories/${filename}`,
    });
  } catch (error) {
    if (error.code === 11000)
      throw new Conflict('category name already exists');
  }

  await fs.promises.writeFile(
    join('public', 'uploads', 'categories', filename),
    req.file.buffer
  );

  return res.json(respondSuccess(doc));
};

/**
 * @type {import("../..").ExpressController}
 */
exports.getCategories = async (req, res, next) => {
  const categories = await categoryModel.find({}, '-nameSlug');
  return res.json(respondSuccess(categories));
};

/**
 * @type {import("../..").ExpressController}
 */
exports.updateCategory = async (req, res, next) => {
  if (req.body.name || req.file) {
    const doc = await categoryModel.findById(req.params.categoryId);
    if (req.body.name) {
      doc.name = req.body.name;
      doc.nameSlug = generateSlug(req.body.name);
    }
    let oldfile = doc.imageUrl.split('/')[3];
    let filename ;
    if (req.file) {
      filename = generateFilename(req.file.mimetype);
      doc.imageUrl = `/uploads/catgories/${filename}`;
    }

    try {
      const response = await doc.save({new: true});
      if (req.file) {
        await fs.promises.unlink(
          join('public', 'uploads', 'categories', oldfile)
        );
        await fs.promises.writeFile(
          join('public', 'uploads', 'categories', filename),
          req.file.buffer
        );
      }
      return res.json(respondSuccess(response));
    } catch (error) {
      if (error.code === 11000) {
        throw new Conflict('Category name is already in use');
      }
      throw error;
    }
  }

  return res.status(204).end();
};


exports.toggleStatus = async (req, res, next) => {
  const doc = await categoryModel.findById(req.params.categoryId);
  doc.isActive = !doc.isActive;
  const newDoc = await doc.save();
  res.json(respondSuccess(newDoc));
} 