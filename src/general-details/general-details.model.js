const {Schema, model, set} = require('mongoose');
const { setGeneralDetails } = require('./general-details.in-memory');

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
  if (doc) {
    setGeneralDetails(doc);
    return;
  };
  const newdoc = await generalDetailsModel.create({}); 
  setGeneralDetails(newdoc);
  return;
}

initGeneralDetails();