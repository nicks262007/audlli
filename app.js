
const winston = require('winston');
const express = require('express');
const app = express();

//passing app reference to startup/routes
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/logging')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.PORT || 3000;
const server = app.listen(port,()=>{
    winston.info(`listening to port ${port}!`);
})

module.exports = server;