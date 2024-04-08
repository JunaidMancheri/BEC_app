const {respondSuccess} = require('../common/response.helper');
const {sendInvitationMail} = require('./email.service');
const {AdminModel} = require('./model');
const {generateAndStoreToken} = require('../auth/token.service');
const {Conflict} = require('http-errors');
const { addToBlockList, removeFromBlockList } = require('../auth/block-list.service');
const { makeLogger } = require('../common/logger.config');

const Logger = makeLogger('Admin');

exports.inviteAdmin = async (req, res) => {
  const admin = await AdminModel.findOne({email: req.body.email});
  if (admin) throw new Conflict('admin  already exists');
  const token = await generateAndStoreToken(req.body.email);
  await sendInvitationMail(req.body.email, token);


  Logger.info('Invited  admin ' + req.body.email);
  res.json(respondSuccess({message: 'Invitation mail send successfully'}));
};

exports.getAdmins = async (req, res) => {
  const admins = await AdminModel.find({isSuperAdmin: false});
  res.json(respondSuccess(admins));
};

exports.deleteAdmin = async (req, res) => {
  await AdminModel.findById(req.params.adminId);
  addToBlockList(req.params.adminId);

  Logger.info('Deleted admin ' + req.params.adminId);
  res.status(204).end();
};

exports.toggleBlock = async (req, res) => {
  const admin = await AdminModel.findById(req.params.adminId);
  admin.isBlocked = !admin.isBlocked;
  admin.isBlocked ? addToBlockList(admin._id) : removeFromBlockList(admin._id);
  await admin.save();
  Logger.info('Changed admin  status  to ' + admin.isBlocked + ' ' + admin.email);
  res.json(respondSuccess(admin));
};
