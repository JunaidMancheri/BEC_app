const {connectToMongoDB} = require('./config/mongodb.config');
const {startServer} = require('./config/express.config');
const {MainLogger} = require('./common/logger.config');

async function bootstrap() {
  await connectToMongoDB();
  await startServer();
}

bootstrap().catch(err => (MainLogger.error(err), process.exit(1)));
