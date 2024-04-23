const {respondSuccess} = require('../common/response.helper');
const {generateFilename} = require('../common/upload.helper');
const {generateSlug} = require('../common/slug.helper');
const {categoryModel} = require('./category.model');
const {Conflict, BadRequest, NotFound} = require('http-errors');
const {join} = require('path');
const fs = require('fs');
const {EventEmitter} = require('../common/EventEmitter');
const {
  cloudinary,
  isCloudinaryUrl,
  getPublicId,
} = require('../common/cloudinary.service');
const {appConfig} = require('../config/app.config');
const {extractFilePathFromUrl} = require('../common/utils');
const {makeLogger} = require('../common/logger.config');

const Logger = makeLogger('Category');

/**
 * @type {import("../../backend").ExpressController}
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
      imageUrl: `${appConfig.APP_BASE_URL}/uploads/categories/${filename}`,
    });
  } catch (error) {
    if (error.code === 11000)
      throw new Conflict('category name already exists');
    throw error;
  }
  const filePath = join('public', 'uploads', 'categories', filename);
  await fs.promises.writeFile(filePath, req.file.buffer);

  Logger.info('Category created ' + doc.name);
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

/**
 * @type {import("../../backend").ExpressController}
 */
exports.getCategories = async (req, res, next) => {
  let filter = {isActive: true};
  if (req.user?.isAdmin) filter = {};
  const categories = await categoryModel.find(filter, '-nameSlug');
  res.json(respondSuccess(categories));
};

/**
 * @type {import("../../backend").ExpressController}
 */
exports.updateCategory = async (req, res, next) => {
  if (!req.body.name && !req.file) {
    return res.status(204).end();
  }

  const doc = await categoryModel.findById(req.params.categoryId);

  if (!doc) throw new NotFound('Category not found');
  if (req.body.name) {
    if (req.body.name.length === 0)
      throw new BadRequest("name shouldn't be empty");
    doc.name = req.body.name;
    doc.nameSlug = generateSlug(req.body.name);
  }
  let oldfileUrl = doc.imageUrl;
  let filename;
  let filePath;
  if (req.file) {
    filename = generateFilename(req.file.mimetype);
    doc.imageUrl = `${appConfig.APP_BASE_URL}/uploads/categories/${filename}`;
    filePath = join('public', 'uploads', 'categories', filename);
  }

  try {
    await doc.save();
    if (req.file) {
      await fs.promises.writeFile(filePath, req.file.buffer);
    }

    Logger.info('Category updated ' + doc._id);
    res.json(respondSuccess(doc)).end();
  } catch (error) {
    if (error.code === 11000) {
      throw new Conflict('Category name is already in use');
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

exports.toggleStatus = async (req, res, next) => {
  const doc = await categoryModel.findById(req.params.categoryId);
  if (!doc) throw new NotFound('Category not found');
  doc.isActive = !doc.isActive;
  await doc.save();
  EventEmitter.emit('Category:StatusChanged', {
    categoryId: doc._id,
    status: doc.isActive,
  });

  Logger.info('Category status changed to ' + doc.isActive + ' ' + doc._id);
  res.json(respondSuccess(doc));
};
