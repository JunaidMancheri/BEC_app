const {mailTransporter} = require('../common/email.helpers');
const {appConfig} = require('../config/app.config');

exports.sendInvitationMail = (email, token) => {
  return new Promise((resolve, reject) => {
    mailTransporter.sendMail({
      to: email,
      subject: `${appConfig.APP_NAME} Invitation`,
      html: `
      Follow this link to start your  account 
       <a href=http://localhost:3000/admins/register/${token}>Click here</a> 
      `,
    }, (err, info) => {
       if (err) reject(err);
       resolve();
    });
  })

};
