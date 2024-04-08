const {Router} = require('express');
const {validateInputs} = require('../common/validators.utils');
const {catchAsync} = require('../common/utils');
const {
  enquiryValidator,
  createEnquiry,
  getEnquiries,
  deleteEnquiry,
} = require('../enquiry');
const {adminRouteGuard} = require('../auth');

const router = Router();

router.post('/', validateInputs(enquiryValidator), catchAsync(createEnquiry));

router.get('/', adminRouteGuard, catchAsync(getEnquiries));

router.delete('/:enquiryId', adminRouteGuard, catchAsync(deleteEnquiry));

exports.enquiryRoutes = router;
