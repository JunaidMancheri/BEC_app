const { createAdmin, getAdminDetails } = require("../admin")
const {Unauthorized} = require('http-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { appConfig } = require("../config/app.config");
const { respondSuccess } = require("../common/response.helper");

exports.registerAdmin = async (req, res) => {
  const email = validateToken(req.body.token);
  const admin = await createAdmin(email, req.body.password);
  res.json(respondSuccess(admin)).status(201);
}

exports.adminLogin = async (req, res) => {
  const admin = await getAdminDetails(req.body.email);
  if (!admin) throw new Unauthorized('Invalid email or password');
  const isCorrect = await bcrypt.compare(req.body.password, admin.hashPassword);
  if (!isCorrect) throw new Unauthorized('Invalid email or password');
  const token = jwt.sign(admin, appConfig.JWT_SECRET_KEY, {expiresIn: '2h'})
  res.json(respondSuccess({token}));
}