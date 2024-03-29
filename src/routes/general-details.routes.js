const { Router } = require("express");
const { validateInputs } = require("../common/validators.utils");
const { generalDetailsValidator, updateGeneralDetails, getGeneralDetails } = require("../general-details");
const { catchAsync } = require("../common/utils");
const { adminRouteGuard } = require("../auth");

const router = Router();

router.put('/', adminRouteGuard, validateInputs(generalDetailsValidator), catchAsync(updateGeneralDetails));

router.get('/',  catchAsync(getGeneralDetails));

exports.generalDetailsRoutes = router;