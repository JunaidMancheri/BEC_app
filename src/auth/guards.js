const {Unauthorized, Forbidden} = require('http-errors');
const jwt = require('jsonwebtoken');
const { hasBlocked } = require('./block-list.service');

exports.adminRouteGuard = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Unauthorized('No jwt token provided');
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, appConfig.JWT_SECRET_KEY);
  } catch (error) {
    throw new Unauthorized('Invalid jwt or token expired');
  }
  if (!decodedToken.isAdmin)
    throw new Forbidden('Only admins can access this route');

  if(hasBlocked(decodedToken._id)) throw new Forbidden('Access revoked');
  req.user = decodedToken;
  next();
};


exports.superAdminRouteGuard = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Unauthorized('No jwt token provided');
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, appConfig.JWT_SECRET_KEY);
  } catch (error) {
    throw new Unauthorized('Invalid jwt or token expired');
  }
  if (!decodedToken.isSuperAdmin)
    throw new Forbidden('Only super admins can access this route');
  req.user = decodedToken;
  next();
};