const { validatorFactory } = require("../common/validators.utils");

const createBannerDtoSchema = {
  type: 'object',
  properties: {
    title: {type: 'string'},
    description: {type: 'string'},
    link: {type: 'string'},
  },
  required: ['title', 'description', 'link'],
  additionalProperties: false,
};

exports.createBannerValidator = validatorFactory(createBannerDtoSchema);