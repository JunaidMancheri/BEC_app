const { validatorFactory } = require("../common/validators.utils");

const generalDetailsSchema = {
  type: 'object',
  properties: {
    email_1: {type: 'string'},
    email_2: {type: 'string'},
    phoneNo_1: {type: 'string'},
    phoneNo_2: {type: 'string'},
  },
  additionalProperties: false,
};



exports.generalDetailsValidator = validatorFactory(generalDetailsSchema);