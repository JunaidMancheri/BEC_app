const { validatorFactory } = require("../common/validators.utils");

const passwordTokenDtoSchema = {
  type: 'object',
  properties: {
    password: {type: 'string', format: 'password'},
    token: {type: 'string'},
  },
  required: ['password', 'token'],
  additionalProperties: false,
};


exports.passwordTokenValidator = validatorFactory(passwordTokenDtoSchema);

const loginAdminDtoSchema = {
  type: 'object',
  properties: {
    password: {type: 'string', format: 'password'},
    email: {type: 'string', format: 'email'}
  },
  required: ['password', 'email'],
  additionalProperties: false,
};

exports.loginAdminValidator = validatorFactory(loginAdminDtoSchema);

const passwordResetLinkDtoSchema = {
  type: 'object',
  properties: {
    email: {type: 'string', format: 'email'}
  },
  required: ['email'],
  additionalProperties: false,
};


exports.passwordResetLinkValidator = validatorFactory(passwordResetLinkDtoSchema);

const updatePasswordDtoSchema = {
  type: 'object',
  properties: {
    newPassword: {type: 'string', format: 'password'},
    oldPassword: {type: 'string', format: 'password'}
  },
  required: ['newPassword', 'oldPassword'],
  additionalProperties: false,
};


exports.updatePasswordValidator = validatorFactory(updatePasswordDtoSchema);