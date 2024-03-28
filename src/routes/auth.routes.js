const {Router} = require('express');
const {validateInputs} = require('../common/validators.utils');
const {
  registerAdminValidator,
  registerAdmin,
  loginAdminValidator,
  adminLogin,
} = require('../auth');
const {catchAsync} = require('../common/catchAsync.utils');

const router = Router();

router.post(
  '/register',
  validateInputs(registerAdminValidator),
  catchAsync(registerAdmin)
);

router.post(
  '/login',
  validateInputs(loginAdminValidator),
  catchAsync(adminLogin)
);

exports.authRoutes = router;
