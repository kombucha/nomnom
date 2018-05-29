const logger = require("./core/logger");
const { launchServer } = require("./server");
const { scheduleJobs } = require("./jobs");

async function start() {
  process.on("uncaughtException", err => {
    logger.error("uncaughtException", err.stack);
  });

  process.on("unhandledRejection", reason => {
    logger.error("unhandledRejection", reason);
  });

  try {
    await scheduleJobs();
    await launchServer();
  } catch (e) {
    logger.error("Failed to launch server");
    logger.error(e);
  }
}

start();
