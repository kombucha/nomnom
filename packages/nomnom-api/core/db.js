const knex = require("knex");
const knexConfig = require("./dbConfig");

const db = knex(knexConfig[process.env.NODE_ENV || "development"]);

module.exports = db;
