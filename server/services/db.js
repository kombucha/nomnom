const pg = require("pg");
const logger = require("./logger");

const config = {
  user: process.env.PG_USER,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  max: 10,
  idleTimeoutMillis: 30000
};

logger.info(`Connecting to database`);
const pool = new pg.Pool(config);

pool.on("error", err => {
  logger.error("idle client error", err.message, err.stack);
});

module.exports = pool;
