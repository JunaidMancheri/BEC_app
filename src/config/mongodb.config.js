const mongoose = require('mongoose');
const {appConfig} = require('./app.config'); 
const { MainLogger } = require('../common/logger.config');

exports.connectToMongoDB =  async function () {
    await mongoose.connect(appConfig.MONGODB_URL)
    MainLogger.info("Connected to MongoDB");
}