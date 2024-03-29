const {MainLogger} = require('../common/logger.config');

const appConfig = {
  MONGODB_URL: 'mongodb://127.0.0.1:27017/bec',
  PORT: 3000,
  APP_BASE_URL: 'http://localhost:3000',
  APP_NAME: 'BEC',
  APP_EMAIL: undefined,
  APP_EMAIL_PASSWORD: undefined,
  JWT_SECRET_KEY: undefined,
};

const loadAppConfig = async function () {
  Object.keys(appConfig).forEach(key => {
    const val = process.env[key];
    if (!val) {
      if (!appConfig[key])
        throw new Error('must specify ' + key + ' in env config');
      return MainLogger.warn(
        'Could not load the value of ' +
          key +
          ' from environment, \nfalling back to default value'
      );
    }
    appConfig[key] = val;
  });
};
exports.appConfig = appConfig;


loadAppConfig();