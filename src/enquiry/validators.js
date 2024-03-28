const { validatorFactory } = require("../common/validators.utils");

const enquiryDtoSchema = {
  type: 'object',
  properties: {
    name: {type: 'string'},
    email: {type: 'string'},
    city: {type: 'string'},
    phoneNo: {type: 'string'},
    note: {type: 'string'},
    post: {type: 'string'},
    course: {type: 'string'},
  },
  required: ['name', 'email', 'phoneNo'],
  additionalProperties: false,
};

exports.enquiryValidator = validatorFactory(enquiryDtoSchema);
