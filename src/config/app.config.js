const appConfig = {
  MONGODB_URL: 'mongodb://127.0.0.1:27017/bec',
  PORT: 3000,
};

exports.loadAppConfig = async function () {
  Object.keys(appConfig).forEach(key => {
    const val = process.env[key];
    if (!val) {
      return console.log(
        'Could not load the value of ' +
          key +
          ' from environment, falling back to default value'
      );
    }
    appConfig[key] = val;
  });
};
exports.appConfig = appConfig;
