const {Router} = require('express');
const {
  createCategoryController,
  categoryDtoValidator,
  getCategories,
  updateCategoryDtoSchema,
  updateCategory,
  toggleStatus,
} = require('../category');
const {catchAsync} = require('../common/utils');
const {validateInputs} = require('../common/validators.utils');
const {uploadTemporary} = require('../common/upload.helper');
const {adminRouteGuard, populateUserDetails} = require('../auth');

const router = Router();

router.post(
  '/',
  // adminRouteGuard,
  uploadTemporary.single('image'),
  validateInputs(categoryDtoValidator),
  catchAsync(createCategoryController)
);

router.get('/', populateUserDetails, catchAsync(getCategories));

router.put(
  '/:categoryId',
  // adminRouteGuard,
  uploadTemporary.single('image'),
  validateInputs(updateCategoryDtoSchema),
  catchAsync(updateCategory)
);

router.patch(
  '/:categoryId/toggle-status',
  adminRouteGuard,
  catchAsync(toggleStatus)
);

exports.categoryRoutes = router;
