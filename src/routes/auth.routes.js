const {Router} = require('express');
const {validateInputs} = require('../common/validators.utils');
const {registerAdminValidator, registerAdmin} = require('../auth');
const {catchAsync} = require('../common/catchAsync.utils');

const router = Router();

router.post(
  '/register',
  validateInputs(registerAdminValidator),
  catchAsync(registerAdmin)
);


exports.authRoutes = router;