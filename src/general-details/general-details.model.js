const {Schema, model} = require('mongoose');

const generalDetailsSchema = new Schema({
  phoneNo_1: {type: String, default: ''},
  phoneNo_2: {type: String, default: ''},
  email_1: {type: String, default: ''},
  email_2: {type: String, default: ''},
});

const generalDetailsModel = model('general-details', generalDetailsSchema);
exports.generalDetailsModel = generalDetailsModel;



async function initGeneralDetails() {
  const doc = await generalDetailsModel.findOne();
  if (doc) return;
  await generalDetailsModel.create({}); 
}

initGeneralDetails();