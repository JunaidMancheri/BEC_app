const Ajv = require('ajv');
const {BadRequest} = require('http-errors');
const ajv = new Ajv();


exports.validatorFactory = (schema) => {
  const verify = ajv.compile(schema);

  const validate = (data) => {
    const isValid = verify(data);
    if (isValid) {
      return data;
    }
    throw new BadRequest(parseError(verify.errors[0]));
  };

  return { schema, validate};
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

exports.validateInputs = (validator) => {
  return (req, _, next) => {
     validator.validate(req.body)
     next()
  }
}

