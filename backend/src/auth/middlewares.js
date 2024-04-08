const jwt = require('jsonwebtoken');
const { appConfig } = require('../config/app.config');
const {Unauthorized} = require('http-errors');

exports.populateUserDetails = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return next();
  try {
    const decodedToken = jwt.verify(token, appConfig.JWT_SECRET_KEY);
    req.user = decodedToken
    next();
  } catch (error) {
    throw new Unauthorized('Invalid jwt or token expired');
  }
}