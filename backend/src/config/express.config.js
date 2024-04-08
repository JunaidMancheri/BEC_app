const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const {appConfig} = require('./app.config');
const {makeLogger, MainLogger} = require('../common/logger.config');
const {routes} = require('../routes');
const createError = require('http-errors');

const HttpLogger = makeLogger('HTTP');

const app = express();

app.use(cors());

app.use(
  morgan('dev', {
    stream: {
      write: message => HttpLogger.info(message),
    },
  })
);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', routes);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    error: {
      status: err.status || 500,
      message: err.message || 'Internal Server Error',
    },
  });
});

exports.startServer = async function () {
  app.listen(appConfig.PORT, () => {
    MainLogger.info('listening on port ' + appConfig.PORT);
  });
};
