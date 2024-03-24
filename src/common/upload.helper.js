const {v4} = require('uuid');
const  multer = require('multer');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

exports.generateFilename = mimetype => `${v4()}.${FILE_TYPE_MAP[mimetype]}`;
exports.generatePdfFilename = () => `${v4()}.pdf`;


exports.uploadTemporary = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.fieldname == 'pdfFile') {
        if(file.mimetype == 'application/pdf') {
          cb(null,true);
        } else {
          cb(new Error('Only pdf files are allowed in the pdfFile field'));
        }
    } else {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg' ];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and JPG images are allowed.'));
      }
    }
  },
})

