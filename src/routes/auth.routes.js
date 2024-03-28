const {Router} = require('express');
const {validateInputs} = require('../common/validators.utils');
const {
  passwordTokenValidator,
  registerAdmin,
  loginAdminValidator,
  adminLogin,
  passwordResetLinkValidator,
  sendResetPasswordLink,
  resetPassword,
  updatePasswordValidator,
  changePassword,
  checkIfInvitationTokenValid,
  adminRouteGuard,
} = require('../auth');
const {catchAsync} = require('../common/catchAsync.utils');

const router = Router();

router.get(
  '/invitation-token-validate/:token',
  catchAsync(checkIfInvitationTokenValid)
);

router.post(
  '/register',
  validateInputs(passwordTokenValidator),
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

router.post(
  '/reset-password',
  validateInputs(passwordTokenValidator),
  catchAsync(resetPassword)
);

router.put(
  '/change-password',
  adminRouteGuard,
  validateInputs(updatePasswordValidator),
  catchAsync(changePassword)
);
exports.authRoutes = router;
