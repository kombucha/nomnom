const winston = require("winston");

const logger = winston.createLogger({
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

logger.stream = {
  write: function(message) {
    logger.info(message);
  }
};

module.exports = logger;
