const { validatorFactory } = require("../common/validators.utils");

const registerAdminDtoSchema = {
  type: 'object',
  properties: {
    email: {type: 'string', format: 'email'},
    password: {type: 'string'}
  },
  required: ['email', 'password'],
  additionalProperties: false,
};


exports.registerAdminValidator = validatorFactory(registerAdminDtoSchema);