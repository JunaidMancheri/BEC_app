const {MainLogger} = require('../common/logger.config');

const appConfig = {
  PORT: 3000,
  APP_NAME: 'BEC',
  MONGODB_URL: undefined,
  APP_BASE_URL: undefined,
  APP_EMAIL: undefined,
  APP_EMAIL_PASSWORD: undefined,
  JWT_SECRET_KEY: undefined,
  CLOUDINARY_CLOUD_NAME: undefined,
  CLOUDINARY_API_KEY: undefined,
  CLOUDINARY_API_SECRET: undefined,
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