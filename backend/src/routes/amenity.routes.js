const {Router} = require('express');
const {uploadTemporary} = require('../common/upload.helper');
const {validateInputs} = require('../common/validators.utils');
const {
  createAmenityValidator,
  createAmenity,
  getAmenities,
  updateAmenity,
  updateAmenityValidator,
  deleteAmenity,
} = require('../amenity');
const {catchAsync} = require('../common/utils');
const {adminRouteGuard} = require('../auth');

const router = Router();

router.post(
  '/',
  // adminRouteGuard,
  uploadTemporary.single('image'),
  validateInputs(createAmenityValidator),
  catchAsync(createAmenity)
);

router.get('/', 
// adminRouteGuard, 
catchAsync(getAmenities));

router.put(
  '/:amenityId',
  // adminRouteGuard,
  uploadTemporary.single('image'),
  validateInputs(updateAmenityValidator),
  catchAsync(updateAmenity)
);

router.delete('/:amenityId', 
// adminRouteGuard, 
catchAsync(deleteAmenity));

exports.amenityRoutes = router;
