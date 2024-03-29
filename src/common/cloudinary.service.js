const cloudinary = require('cloudinary');
const {appConfig} = require('../config/app.config');

cloudinary.v2.config({
  cloud_name: 'dghi8du2s',
  api_key: '789913187588676',
  api_secret: '_Xod5tUlEmmfOhamhyUL_ozDlHU',
});

exports.cloudinary = cloudinary.v2;
exports.isCloudinaryUrl = url =>
  url.startsWith(appConfig.APP_BASE_URL) ? false : true;
exports.getPublicId = url => {
  const urlParts = url.split('/');
  const publicIdWithExtension = urlParts[urlParts.length - 1];
  const publicId = publicIdWithExtension.split('.')[0];
  return publicId;
};
