const { validatorFactory } = require("../common/validators.utils");

const inviteAdminDtoSchema = {
  type: 'object',
  properties: {
    email: {type: 'string', format: 'email'},
  },
  required: ['email'],
  additionalProperties: false,
};


exports.inviteAdminValidator = validatorFactory(inviteAdminDtoSchema);
