if (!process.env.DATABASE_URI) {
  require("dotenv").config({ path: require("path").resolve("../.env") });
}

const path = require("path");
const logger = require("./logger");

const common = {
  // pool: {
  //   afterCreate: () => logger.info(`Connected to database ${process.env.DATABASE_URI}`)
  // },
  migrations: {
    tableName: "migrations",
    directory: path.resolve(__dirname, "../migrations")
  },
  log: {
    warn: logger.warn,
    error: logger.error
  }
};

module.exports = {
  development: {
    ...common,
    client: "sqlite3",
    connection: { filename: process.env.DATABASE_URI },
    useNullAsDefault: true
  },
  production: {
    ...common,
    client: "pg",
    connection: process.env.DATABASE_URI
  }
};
