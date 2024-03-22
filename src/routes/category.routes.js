const {Router} = require('express');
const {
  createCategoryController,
  categoryDtoValidator,
} = require('../category');
const {catchAsync} = require('../common/catchAsync.utils');
const {validateInputs} = require('../common/validators.utils');
const { uploadTemporary } = require('../common/upload.helper');


const router = Router();

router.post(
  '/',
  uploadTemporary.single('image'),
  validateInputs(categoryDtoValidator),
  catchAsync(createCategoryController)
);

exports.categoryRoutes = router;
