const mongoose = require('mongoose');
const {appConfig} = require('./app.config'); 

exports.connectToMongoDB =  async function () {
    await mongoose.connect(appConfig.MONGODB_URL)
    console.log("Connected to MongoDB");
}