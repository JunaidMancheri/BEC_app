const {createAdmin, getAdminDetails, resetPassword} = require('../admin');
const {Unauthorized, NotFound} = require('http-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {appConfig} = require('../config/app.config');
const {respondSuccess} = require('../common/response.helper');
const {
  generateToken,
  storeResetPasswordToken,
  validateResetPasswordToken,
  validateToken,
} = require('./token.service');
const {sendResetPasswordLink} = require('./email.service');
const { addToBlockList } = require('./block-list.service');

exports.checkIfInvitationTokenValid = async (req, res) => {
  const email = validateToken(req.params.token);
  res.json(respondSuccess({email}));
};

exports.registerAdmin = async (req, res) => {
  const email = validateToken(req.body.token);
  const admin = await createAdmin(email, req.body.password);
  res.json(respondSuccess(admin)).status(201);
};

exports.adminLogin = async (req, res) => {
  const admin = await getAdminDetails(req.body.email);
  if (!admin) throw new Unauthorized('Invalid email or password');
  if (admin.isBlocked) {
    addToBlockList(admin._id);
    throw new Unauthorized('Access revoked');
  }
  const isCorrect = await bcrypt.compare(req.body.password, admin.hashPassword);
  if (!isCorrect) throw new Unauthorized('Invalid email or password');
  const token = jwt.sign({isAdmin: true, ...admin}, appConfig.JWT_SECRET_KEY, {
    expiresIn: '2h',
  });
  res.json(respondSuccess({token}));
};

exports.sendResetPasswordLink = async (req, res) => {
  const isExist = await getAdminDetails(req.body.email);
  if (!isExist) throw new NotFound('No admin found with this email address');
  const token = await generateToken();
  storeResetPasswordToken(req.body.email, token);
  await sendResetPasswordLink(req.body.email, token);
  res.json(
    respondSuccess({message: 'Reset password link sent to mail successfully'})
  );
};

exports.validateResetPasswordToken = async (req, res) => {
  const email = this.validateResetPasswordToken(req.params.token);
  res.json(respondSuccess({email}));
};

exports.resetPassword = async (req, res) => {
  const email = validateResetPasswordToken(req.body.token);
  await resetPassword(email, req.body.password);
  res.json(respondSuccess({message: 'Password  reset successfully'}));
};

exports.changePassword = async (req, res) => {
  const email = req.user.email;
  const admin = await getAdminDetails(email);
  if (!admin) throw new NotFound('admin not found');
  const oldPasswordCorrect = await bcrypt.compare(
    req.body.oldPassword,
    admin.hashPassword
  );
  if (!oldPasswordCorrect) throw new Unauthorized('Old password is incorrect');
  const hash = await bcrypt.hash(req.body.newPassword, 10);
  admin.hashPassword = hash;
  await admin.save();
  res.json(respondSuccess({message: 'password updated successfully'}));
};
