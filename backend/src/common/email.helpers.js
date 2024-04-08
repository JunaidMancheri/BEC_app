const nodemailer = require('nodemailer');
const { appConfig } = require('../config/app.config');
const email = appConfig.APP_EMAIL;
exports.mailTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  auth: {
    user: email,
    pass: appConfig.APP_EMAIL_PASSWORD,
  },
});
