const {respondSuccess} = require('../common/response.helper');
const {generateFilename} = require('../common/upload.helper');
const {generateSlug} = require('../common/slug.helper');
const {categoryModel} = require('./category.model');
const {Conflict} = require('http-errors');
const {join} = require('path');
const fs = require('fs');
/**
 * @type {import("../..").ExpressController}
 */
exports.createCategoryController = async (req, res, next) => {
  if (!req.file) throw new createHttpError.BadRequest('image is required');

  const filename = generateFilename(req.file.mimetype);
  let doc;
  try {
   doc =  await categoryModel.create({
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
  return res.json(respondSuccess(categories))
}
