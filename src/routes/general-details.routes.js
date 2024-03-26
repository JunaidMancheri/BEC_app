const { Router } = require("express");
const { validateInputs } = require("../common/validators.utils");
const { generalDetailsValidator, updateGeneralDetails, getGeneralDetails } = require("../general-details");
const { catchAsync } = require("../common/catchAsync.utils");

const router = Router();

router.put('/', validateInputs(generalDetailsValidator), catchAsync(updateGeneralDetails));

router.get('/', catchAsync(getGeneralDetails));

exports.generalDetailsRoutes = router;