const { startListeningToEvents } = require('./event.handlers')

module.exports = {
  ...require('./post.controller'),
  ...require('./validators'),
  ...require('./post.service'),
}

startListeningToEvents()