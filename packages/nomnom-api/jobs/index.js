// require("dotenv").config();

const express = require("express");
const logger = require("../core/logger");
const updateFeeds = require("./updateFeeds");

const app = express();

app.use("/", (req, res) => {
  // One job for now, just trigger this one
  updateFeeds();
  res.sendStatus(200);
});

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("Something broke!");
});

process.on("uncaughtException", err => {
  logger.error("uncaughtException", err.stack);
});

process.on("unhandledRejection", reason => {
  logger.error("unhandledRejection", reason);
});

const port = parseInt(process.env.JOBS_PORT, 10);
app.listen(port);
logger.info(`Running jobs server at http://localhost:${port}`);
