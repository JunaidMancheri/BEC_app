const {Router} = require('express');
const {catchAsync} = require('../common/utils');
const {
  inviteAdmin,
  getAdmins,
  deleteAdmin,
  toggleBlock,
} = require('../admin/controller');
const {validateInputs} = require('../common/validators.utils');
const {inviteAdminValidator} = require('../admin/validators');
const {superAdminRouteGuard} = require('../auth');

const router = Router();

router.post(
  '/invite',
  // superAdminRouteGuard,
  validateInputs(inviteAdminValidator),
  catchAsync(inviteAdmin)
);

router.get('/', 
// superAdminRouteGuard, 
catchAsync(getAdmins));
router.delete('/:adminId', 
// superAdminRouteGuard, 
catchAsync(deleteAdmin));

router.patch(
  '/toggle-block/:adminId',
  // superAdminRouteGuard,
  catchAsync(toggleBlock)
);
exports.adminRoutes = router;
