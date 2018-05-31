const Queue = require("bull");

const logger = require("../core/logger");
const { queue: feedsQueue, FEEDS_UPDATE } = require("./updateFeeds/queue");
const { queue: readabilityQueue } = require("./readability/queue");
const { removeAllJobs, removeRepeatableJobs } = require("./utils");

const AN_HOUR_AGO = 3600000;
const A_DAY_AGO = 24 * 3600000;
const EVERY_HOUR = "0 * * * *";

const queues = [feedsQueue, readabilityQueue];

const maintenanceQueue = new Queue("maintenance", process.env.REDIS_URL);
maintenanceQueue.process(async () => {
  for (let queue of queues) {
    logger.info(`Cleaning queue '${queue.name}'...`);
    await queue.clean(AN_HOUR_AGO, "completed");
    await queue.clean(A_DAY_AGO, "failed");
  }
});

async function shutdownQueues() {
  for (let queue of [...queues, maintenanceQueue]) {
    await queue.close();
  }
}

async function setupQueues() {
  if (process.env.NODE_ENV !== "production") {
    for (let queue of queues) {
      logger.info(`[DEV] Emptying queue '${queue.name}'...`);
      await removeAllJobs(queue);
    }
    return;
  }

  logger.info(`[PROD] Cleaning repeatable jobs...`);
  for (let queue of queues) {
    await removeRepeatableJobs(queue);
  }

  logger.info(`[PROD] Scheduling "${FEEDS_UPDATE}" (cron: ${EVERY_HOUR})`);
  feedsQueue.add(FEEDS_UPDATE, {}, { repeat: { cron: EVERY_HOUR } });

  logger.info(`[PROD] Scheduling maintenance (cron: ${EVERY_HOUR})`);
  maintenanceQueue.add({}, { repeat: { cron: EVERY_HOUR } });
}

function getQueuesNames() {
  return [...queues.map(q => q.name), maintenanceQueue.name];
}

module.exports = {
  setupQueues,
  shutdownQueues,
  getQueuesNames
};
