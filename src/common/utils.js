const { appConfig } = require("../config/app.config");
const {join} = require('path');

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((e) => (console.log(e),next(e)));
  };
};


exports.catchAsync = catchAsync;

exports.extractFilePathFromUrl = (url) => {
    const baseUrl = appConfig.APP_BASE_URL;
    const relativePath = url.replace(baseUrl, '');
    return join('public', ...relativePath.split('/'));
}