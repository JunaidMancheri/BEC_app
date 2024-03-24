const {Router} = require('express');
const {uploadTemporary} = require('../common/upload.helper');
const {validateInputs} = require('../common/validators.utils');
const {createAmenityValidator, createAmenity, getAmenities} = require('../amenity');
const {catchAsync} = require('../common/catchAsync.utils');

const router = Router();

router.post(
  '/',
  uploadTemporary.single('image'),
  validateInputs(createAmenityValidator),
  catchAsync(createAmenity)
);

router.get('/', catchAsync(getAmenities));

exports.amenityRoutes = router;
