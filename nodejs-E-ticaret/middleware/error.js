
const logger = require('../middleware/logger');


module.exports=function (err,req, res, next) {
    logger.log("error",err.message)
    res.status(404).send("Sorry can't find that!");
  }
