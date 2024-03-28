const {respondSuccess} = require('../common/response.helper');
const { sendMailToUser, sendMailToAdmins } = require('./email.service');
const {EnquiryModel} = require('./model');

exports.createEnquiry = async (req, res) => {
  const data = await EnquiryModel.create({
    name: req.body.name,
    city: req.body.city,
    email: req.body.email,
    phoneNo: req.body.phoneNo,
    note: req.body.note,
    course: req.body.course,
    post: req.body.post,
    type: req.body.post ? 'specialized' : 'general',
  });
  sendMailToUser(data,req.body.email);
  sendMailToAdmins(data)
  res.end();
};

exports.getEnquiries = async (req, res) => {
  const enquiries = await EnquiryModel.find();
  res.json(respondSuccess(enquiries));
};

exports.deleteEnquiry = async (req, res) => {
  await EnquiryModel.findByIdAndDelete(req.params.enquiryId);
  res.status(204).end();
};
