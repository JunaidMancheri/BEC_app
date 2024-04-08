const { validatorFactory } = require("../common/validators.utils");

const createPostDtoSchema = {
  type: 'object',
  properties: {
    title: {type: 'string'},
    description: {type: 'string'},
    category: {type: 'string'},
    contactNumber: {type: 'string'},
    amenities: {type: 'array', items: {type: 'string'}},
    courses: {type: 'array', items: {type: 'string'}},
  },
  required: ['title', 'description', 'contactNumber', 'category', 'courses'],
  additionalProperties: false,
};

exports.createPostValidator = validatorFactory(createPostDtoSchema);


const updatePostDtoSchema = {
  type: 'object',
  properties: {
    title: {type: 'string'},
    description: {type: 'string'},
    category: {type: 'string'},
    contactNumber: {type: 'string'},
    amenities: {type: 'array', items: {type: 'string'}},
    courses: {type: 'array', items: {type: 'string'}},
  },
  additionalProperties: false,
};

exports.updatePostValidator = validatorFactory(updatePostDtoSchema);