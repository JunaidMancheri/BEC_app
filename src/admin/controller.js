const {respondSuccess} = require('../common/response.helper');
const {sendInvitationMail} = require('./email.service');
const { AdminModel } = require('./model');
const {generateAndStoreToken, validateToken} = require('../auth/token.service');
const {Conflict} = require('http-errors');


exports.inviteAdmin = async (req, res) => {
  const admin = await AdminModel.findOne({email: req.body.email});
  if (admin) throw new Conflict('admin  already exists');
  const token = await generateAndStoreToken(req.body.email);
  await sendInvitationMail(req.body.email, token);
  res.json(respondSuccess({message: 'Invitation mail send successfully'}));
};


exports.getAdmins = async (req, res) => {
  const admins = await AdminModel.find({isSuperAdmin: false});
  res.json(respondSuccess(admins));
}


exports.deleteAdmin = async (req, res) => {
  await AdminModel.findById(req.params.adminId);
  res.status(204).end();
}
