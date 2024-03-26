const { validatorFactory } = require("../common/validators.utils");

const createCourseDtoSchema = {
  type: 'object',
  properties: {
    name: {type: 'string'},
    description: {type: 'string'},
    duration: {type: ['number', 'string']},
    type: {type: 'string', enum: ['postgraduate', 'undergraduate']},
  },
  required: ['name', 'description', 'duration', 'type'],
  additionalProperties: false,
};

exports.createCourseValidator = validatorFactory(createCourseDtoSchema);


const updateCourseSchema = {
  type: 'object',
  properties: {
    name: {type: 'string'},
    description: {type: 'string'},
    duration: {type: ['number', 'string']},
    type: {type: 'string', enum: ['postgraduate', 'undergraduate']},
  },
  additionalProperties: false,
};


exports.updateCourseValidator = validatorFactory(updateCourseSchema);