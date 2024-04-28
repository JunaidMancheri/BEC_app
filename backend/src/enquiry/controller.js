const {makeLogger} = require('../common/logger.config');
const {respondSuccess} = require('../common/response.helper');
const {sendMailToUser, sendMailToAdmins} = require('./email.service');
const {EnquiryModel} = require('./model');

const Logger = makeLogger('Enquiry');

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
  Logger.info('sending mail to the user ' + data.email);
  sendMailToUser(data, req.body.email);
  Logger.info('sending mail to the admins');
  sendMailToAdmins(data);

  Logger.info('New Enquiry received', {name: data.name, email: data.email});
  res.end();
};

exports.getEnquiries = async (req, res) => {
  const enquiries = await EnquiryModel.find()
    .populate('course')
    .populate('post')
    .sort({createdAt: -1});
  res.json(respondSuccess(enquiries));
};

exports.deleteEnquiry = async (req, res) => {
  await EnquiryModel.findByIdAndDelete(req.params.enquiryId);
  Logger.info('Deleted ' + req.params.enquiryId);
  res.status(204).end();
};
