const express = require('express');
const {connectToMongoDB} = require('./config/mongodb.config');
const {loadAppConfig} = require('./config/app.config');
const {startServer} = require('./config/express.config');

async function bootstrap() {
  await loadAppConfig();
  await connectToMongoDB();
  await startServer();
}

bootstrap().catch(err => console.log(err));
