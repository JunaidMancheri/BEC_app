const Ajv = require('ajv');
const createHttpError = require('http-errors');
const ajv = new Ajv();


exports.validatorFactory = (schema) => {
  const validate = ajv.compile(schema);

  const verify = (data) => {
    const isValid = validate(data);
    if (isValid) {
      return data;
    }
    throw new createHttpError.BadRequest(parseError(validate.errors[0]));
  };

  return { schema, verify };
};


function parseError(error)  {
  switch (error.keyword) {
    case 'required':
      return `${error.params.missingProperty} field is required.`;
    case 'type':
      return `${error.instancePath.slice(1)} should be type of ${error.params.type}`
    case 'additionalProperties':
      return `should not contain additional properties, found ${error.params.additionalProperty}`
    default:
      return "Invalid data.";
  }
}

