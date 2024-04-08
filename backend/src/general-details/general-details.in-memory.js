let generalDetails = {};

exports.setGeneralDetails = data => (generalDetails = data);
exports.getGeneralDetails = () => generalDetails;
exports.getGeneralEmails = () => ({
  email_1: generalDetails.email_1,
  email_2: generalDetails.email_2,
});
