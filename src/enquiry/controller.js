const {respondSuccess} = require('../common/response.helper');
const {EnquiryModel} = require('./model');

exports.createEnquiry = async (req, res) => {
  await EnquiryModel.create({
    name: req.body.name,
    city: req.body.city,
    email: req.body.email,
    phoneNo: req.body.phoneNo,
    note: req.body.note,
    course: req.body.course,
    post: req.body.post,
    type: req.body.post ? 'specialized' : 'general',
  });
  res.end();
};

exports.getEnquiries = async (req, res) => {
  const enquiries = await EnquiryModel.find();
  res.json(respondSuccess(enquiries));
};
