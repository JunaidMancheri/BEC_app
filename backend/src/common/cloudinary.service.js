const cloudinary = require('cloudinary');
const {appConfig} = require('../config/app.config');

cloudinary.v2.config({
  cloud_name: appConfig.CLOUDINARY_CLOUD_NAME,
  api_key: appConfig.CLOUDINARY_API_KEY,
  api_secret: appConfig.CLOUDINARY_API_SECRET,
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
