const {Router} = require('express');
const {validateInputs} = require('../common/validators.utils');
const {catchAsync} = require('../common/catchAsync.utils');
const {enquiryValidator, createEnquiry, getEnquiries} = require('../enquiry');

const router = Router();

router.post('/', validateInputs(enquiryValidator), catchAsync(createEnquiry));

router.get('/', catchAsync(getEnquiries));

exports.enquiryRoutes = router;
