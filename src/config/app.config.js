const { MainLogger } = require("../common/logger.config");

const appConfig = {
  MONGODB_URL: 'mongodb://127.0.0.1:27017/bec',
  PORT: 3000,
};

exports.loadAppConfig = async function () {
  Object.keys(appConfig).forEach(key => {
    const val = process.env[key];
    if (!val) {
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
