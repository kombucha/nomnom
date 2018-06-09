const logger = require("./core/logger");
const { launchServer } = require("./server");
const { setupQueues, shutdownQueues } = require("./jobs");

async function gracefulShutdown() {
  await shutdownQueues();
  process.exit();
}

async function start() {
  process.on("uncaughtException", err => {
    logger.error("uncaughtException", err.stack);
  });

  process.on("unhandledRejection", reason => {
    logger.error("unhandledRejection", reason);
  });

  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);

  try {
    await setupQueues();
    await launchServer();
  } catch (e) {
    logger.error("Failed to launch server");
    logger.error(e);
  }
}

start();
