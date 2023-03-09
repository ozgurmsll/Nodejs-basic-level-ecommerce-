const winston = require('winston');
require("winston-mongodb");

const {combine,timestamp,prettyPrint} = winston.format;
const config=require("config");
const username=config.get("db.username");
const password = config.get("db.password");

const database=config.get("db.name");
const logger = winston.createLogger({
    level: 'debug',
    format: 
    combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log',level: 'error' }),

    ]

});    


module.exports = logger;