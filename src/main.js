const {connectToMongoDB} = require('./config/mongodb.config');
const {startServer} = require('./config/express.config');
const {MainLogger} = require('./common/logger.config');
const {join} = require('path');
const fs = require('fs');

async function bootstrap() {
  await ensureUploadFoldersExists();
  await connectToMongoDB();
  await startServer();
}

bootstrap().catch(err => (MainLogger.error(err), process.exit(1)));

async function ensureUploadFoldersExists() {
  const publicFolder = join('public');
  const uploadRootFolder = join(publicFolder, 'uploads');
  const foldersPaths = [
    publicFolder,
    uploadRootFolder,
    join(uploadRootFolder, 'posts'),
    join(uploadRootFolder, 'pdf'),
    join(uploadRootFolder, 'amenities'),
    join(uploadRootFolder, 'categories'),
    join(uploadRootFolder, 'banners'),
  ];

  for (const path of foldersPaths) {
    if (!fs.existsSync(path)) {
      MainLogger.warn("Didn't find folder at path " + path);
      fs.mkdirSync(path);
      MainLogger.info('Created folder at path ' + path);
    }
  }
}
