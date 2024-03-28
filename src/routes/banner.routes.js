const {Router} = require('express');
const {uploadTemporary} = require('../common/upload.helper');
const {validateInputs} = require('../common/validators.utils');
const {
  createBannerValidator,
  createBanner,
  getBanners,
  deleteBanner,
  toggleBannerStatus,
  updateBannerValidator,
  updateBanner,
} = require('../banner');
const {catchAsync} = require('../common/catchAsync.utils');
const {adminRouteGuard, populateUserDetails} = require('../auth');

const router = new Router();

router.post(
  '/',
  adminRouteGuard,
  uploadTemporary.single('image'),
  validateInputs(createBannerValidator),
  catchAsync(createBanner)
);

router.get('/', populateUserDetails, catchAsync(getBanners));

router.delete('/:bannerId', adminRouteGuard, catchAsync(deleteBanner));

router.patch(
  '/:bannerId/toggle-status',
  adminRouteGuard,
  catchAsync(toggleBannerStatus)
);
router.put(
  '/:bannerId',
  adminRouteGuard,
  uploadTemporary.single('image'),
  validateInputs(updateBannerValidator),
  catchAsync(updateBanner)
);

exports.bannerRoutes = router;
