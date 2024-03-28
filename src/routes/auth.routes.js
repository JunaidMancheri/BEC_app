const {Router} = require('express');
const {validateInputs} = require('../common/validators.utils');
const {
  registerAdminValidator,
  registerAdmin,
  loginAdminValidator,
  adminLogin,
  passwordResetLinkValidator,
  sendResetPasswordLink,
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

router.post(
  '/send-password-reset-link',
  validateInputs(passwordResetLinkValidator),
  catchAsync(sendResetPasswordLink)
);

router.get(
  '/reset-password-token-validate/:token',
  catchAsync(validateResetPasswordToken)
);
exports.authRoutes = router;
