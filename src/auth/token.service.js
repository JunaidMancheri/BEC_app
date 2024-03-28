const crypto = require('crypto');
const {Forbidden} = require('http-errors');

const tokens = {};

function storeToken(token, email) {
  tokens[email] = {token, expirestAt: Date.now() + 900000};
}

exports.validateToken = (token, email) => {
  for (const [key, value] of Object.entries(tokens)) {
    if (token === value.token) {
      const now = Date.now();
      if (now > value.expirestAt)
        throw new Forbidden(
          'token expired, please ask admin to generate new link'
        );
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
