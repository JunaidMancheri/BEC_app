const {Router} = require('express');
const {uploadTemporary} = require('../common/upload.helper');
const {validateInputs} = require('../common/validators.utils');
const {createBannerValidator, createBanner, getBanners, deleteBanner} = require('../banner');
const {catchAsync} = require('../common/catchAsync.utils');

const router = new Router();

router.post(
  '/',
  uploadTemporary.single('image'),
  validateInputs(createBannerValidator),
  catchAsync(createBanner)
);

router.get('/', catchAsync(getBanners));

router.delete('/:bannerId', catchAsync(deleteBanner));

exports.bannerRoutes = router;