const pg = require("pg");
const logger = require("./logger");

const config = {
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000
};

const pool = new pg.Pool(config);

pool.on("connect", () => {
  logger.info(`Connecting to database`);
});

pool.on("error", err => {
  logger.error("idle client error", err.message, err.stack);
});

module.exports = pool;
