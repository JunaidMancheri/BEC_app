const express = require('express');
const {connectToMongoDB} = require('./config/mongodb.config');
const {loadAppConfig} = require('./config/app.config');
const {startServer} = require('./config/express.config');
const { MainLogger } = require('./common/logger.config');

async function bootstrap() {
  await loadAppConfig();
  await connectToMongoDB();
  await startServer();
}

bootstrap().catch(err => MainLogger.error(err));
