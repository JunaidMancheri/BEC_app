const { validatorFactory } = require("../common/validators.utils");

const createAmenityDtoSchema = {
  type: "object",
  properties: {
    name: { type: "string" ,
  },
  },
  required: ["name"],
  additionalProperties: false,
};


exports.createAmenityValidator = validatorFactory(createAmenityDtoSchema);


const updateAmenityDtoSchema = {
  type: "object",
  properties: {
    name: { type: "string" ,
  },
  },
  additionalProperties: false,
};

exports.updateAmenityValidator = validatorFactory(updateAmenityDtoSchema);
