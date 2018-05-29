const logger = require("../core/logger");
const { queue: feedsQueue, FEEDS_UPDATE } = require("./updateFeeds/queue");
const { queue: readabilityQueue } = require("./readability/queue");
const { removeAllJobs, removeRepeatableJobs } = require("./utils");

const AN_HOUR_AGO = 3600000;
const A_DAY_AGO = 24 * 3600000;
const EVERY_HOUR = "0 * * * *";

const queues = [feedsQueue, readabilityQueue];

async function scheduleJobs() {
  if (process.env.NODE_ENV === "production") {
    for (let queue of queues) {
      logger.info(`Cleaning queue '${queue.name}'...`);
      await queue.clean(AN_HOUR_AGO, "completed");
      await queue.clean(A_DAY_AGO, "failed");
    }
  } else {
    for (let queue of queues) {
      logger.info(`Emptying queue '${queue.name}'...`);
      await removeAllJobs(queue);
    }
  }

  logger.info(`Cleaning repeatable jobs...`);
  for (let queue of queues) {
    await removeRepeatableJobs(queue);
  }

  if (process.env.NODE_ENV === "production") {
    logger.info(`Scheduling "${FEEDS_UPDATE}" (cron: ${EVERY_HOUR})`);
    feedsQueue.add(FEEDS_UPDATE, {}, { repeat: { cron: EVERY_HOUR } });
  }
}

function getQueuesNames() {
  return queues.map(q => q.name);
}

module.exports = {
  scheduleJobs,
  getQueuesNames
};
