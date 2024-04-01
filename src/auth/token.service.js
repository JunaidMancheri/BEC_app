const crypto = require('crypto');
const {Forbidden} = require('http-errors');

const tokens = {
  resetPassword : {},
  invitation: {},
};

function storeToken(token, email) {
  tokens.invitation[email] = {token, expirestAt: Date.now() + 900000};
}

exports.validateToken = (token, email) => {
  for (const [key, value] of Object.entries(tokens.invitation)) {
    if (token === value.token) {
      const now = Date.now();
      if (now > value.expirestAt) {
        delete tokens.invitation[key];
        throw new Forbidden(
          'token expired, please ask admin to generate new link'
        );
      }
      return key;
    }
  }
  throw new Forbidden('Invalid token');
};

exports.generateAndStoreToken = function (email) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        const token = buffer.toString('hex');
        storeToken(token, email);
        resolve(token);
      }
    });
  });
};

exports.storeResetPasswordToken = function (email, token) {
  tokens.resetPassword[email] = {token, expiresAt: Date.now() + 900000}
}


exports.generateToken = function () {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        const token = buffer.toString('hex');
        resolve(token);
      }
    });
  });
}


exports.deleteInvitationToken = (email) => {
  delete tokens.invitation[email];
}

exports.deleteResetPasswordToken = (email) => {
  delete tokens.resetPassword[email];
}

exports.validateResetPasswordToken = function (token) {
  for (const [key, value] of Object.entries(tokens.resetPassword)) {
    if (token === value.token) {
      const now = Date.now();
      if (now > value.expirestAt) {
        delete tokens.resetPassword[key];
        throw new Forbidden(
          'token expired, please ask admin to generate new link'
        );
      }

      return key;
    }
  }
  throw new Forbidden('Invalid token');
}