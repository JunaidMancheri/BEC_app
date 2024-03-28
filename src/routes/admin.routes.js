const {Router} = require('express');
const {catchAsync} = require('../common/catchAsync.utils');
const {inviteAdmin, getAdmins, deleteAdmin, toggleBlock} = require('../admin/controller');
const {validateInputs} = require('../common/validators.utils');
const {inviteAdminValidator} = require('../admin/validators');

const router = Router();

router.post(
  '/invite',
  validateInputs(inviteAdminValidator),
  catchAsync(inviteAdmin)
);

router.get('/', catchAsync(getAdmins));
router.delete('/:adminId', catchAsync(deleteAdmin));

router.patch('/toggle-block/:adminId', catchAsync(toggleBlock));
exports.adminRoutes = router;
