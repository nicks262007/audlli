const winston = require('winston'); //for logging
require('winston-mongodb'); //for mongodb logging

module.exports = function(){
    // winston.handleException(
    //     new winston.transports.File({ filename: 'uncaughtException.log'})
    // )

    process.on('unhandledRejection', (ex)=>{
        throw ex;
    })
    //adding winston transports
    winston.add(winston.transports.File, { filename: 'logfile.log'});
    // winston.add(winston.transports.mongoDB, { db: 'mongodb://localhost/AUDLEY'});

    //Handle uncaught exception outside the express.
    process.on('uncaughtException', (ex)=>{
        console.log('we got a uncaught exception.');
        winston.error(ex.message, ex);  
    })
    // throw new Error('uncaughtException');
    // new Promise.reject(new Error('promise rejected.'));

}