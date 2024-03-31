const {mailTransporter} = require('../common/email.helpers');
const {appConfig} = require('../config/app.config');

exports.sendResetPasswordLink = (email, token) => {
  return new Promise((resolve, reject) => {
    mailTransporter.sendMail({
      to: email,
      subject: `${appConfig.APP_NAME} Password reset`,
      html: `
       <a href=${appConfig.FRONTEND_BASE_URL}/auth/password-reset/${token}>Click here</a> 
       reset your account password 
      `,
    }, (err, info) => {
       if (err) reject(err);
       resolve();
    });
  })

};
