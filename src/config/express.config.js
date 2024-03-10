const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { appConfig } = require('./app.config');

const app = express();

app.use(cors());
app.use(morgan());
app.use(express.json());
app.use(express.urlencoded());


exports.startServer = async function() {
  app.listen(appConfig.PORT, () => {
    console.log('listening on port ' + appConfig.PORT);
  })
}
