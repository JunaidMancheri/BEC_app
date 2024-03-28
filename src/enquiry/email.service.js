const { getGeneralEmails } = require("../general-details")

exports.sendMailToUser = (data, email) => {
    mailTransporter.sendMail({
      to: email,
      subject: `${appConfig.APP_NAME} Enquiry response`,
      html: `
       ${data}
      `,
    }, ()=>{})
}

exports.sendMailToAdmins = (data) => {
  const {email_1, email_2} = getGeneralEmails();
  if (email_1) {
    mailTransporter.sendMail({
      to: email_1,
      subject: `${appConfig.APP_NAME} Enquiry response`,
      html: `
       ${data}
      `,
    }, ()=>{})
  }

  if (email_2) {
    mailTransporter.sendMail({
      to: email_2,
      subject: `${appConfig.APP_NAME} Enquiry response`,
      html: `
       ${data}
      `,
    }, ()=>{})
  }

}