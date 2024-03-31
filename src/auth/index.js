module.exports = {
  ...require('./controller'),
  ...require('./token.service'),
  ...require('./validators'),
  ...require('./guards'),
  ...require('./middlewares'),
}