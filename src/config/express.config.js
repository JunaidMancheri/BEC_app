const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { appConfig } = require('./app.config');
const { makeLogger, MainLogger } = require('../common/logger.config');

const HttpLogger = makeLogger('HTTP')

const app = express();

app.use(cors());
app.use(morgan('dev', {stream: {
  write: (message) => HttpLogger.info(message),
}}));
app.use(express.json());
app.use(express.urlencoded());


exports.startServer = async function() {
  app.listen(appConfig.PORT, () => {
    MainLogger.info('listening on port ' + appConfig.PORT);
  })
}
