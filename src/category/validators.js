const { validatorFactory } = require("../common/validatorFactory.utils");

const categoryDtoSchema = {
  type: "object",
  properties: {
    name: { type: "string" ,
  },
  },
  required: ["name"],
  additionalProperties: false,
};

exports.categoryDtoValidator = validatorFactory(categoryDtoSchema);