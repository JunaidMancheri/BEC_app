const {getGeneralEmails} = require('./general-details.in-memory')

module.exports = {
  ...require('./controller'),
  ...require('./validators'),
  getGeneralEmails,
}