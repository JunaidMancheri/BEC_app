const createHttpError = require('http-errors');
const {categoryModel} = require('./category.model');
const {respondSuccess} = require('../common/response.helper');
const fs = require('fs');
const {join} = require('path');
const {generateFilename} = require('../common/upload.helper');
const {generateSlug} = require('../common/slug.helper');
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
      imageUrl: `/public/uploads/categories/${filename}`,
    });
  } catch (error) {
    if (error.code === 11000)
      throw new createHttpError.Conflict('category name already exists');
  }

  await fs.promises.writeFile(
    join('src', 'public', 'uploads', 'categories', filename),
    req.file.buffer
  );

  return res.json(respondSuccess(doc));
};
