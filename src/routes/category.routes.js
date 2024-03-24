const {Router} = require('express');
const {
  createCategoryController,
  categoryDtoValidator,
  getCategories,
  updateCategoryDtoSchema,
  updateCategory,
} = require('../category');
const {catchAsync} = require('../common/catchAsync.utils');
const {validateInputs} = require('../common/validators.utils');
const {uploadTemporary} = require('../common/upload.helper');

const router = Router();

router.post(
  '/',
  uploadTemporary.single('image'),
  validateInputs(categoryDtoValidator),
  catchAsync(createCategoryController)
);

router.get('/', catchAsync(getCategories));

router.put(
  '/:categoryId',
  uploadTemporary.single('image'),
  validateInputs(updateCategoryDtoSchema),
  catchAsync(updateCategory)
);

exports.categoryRoutes = router;
