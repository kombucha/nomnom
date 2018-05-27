const { queue: feedsQueue, FEEDS_UPDATE } = require("./jobs/updateFeeds/queue");
const { queue: readabilityQueue } = require("./jobs/readability/queue");
const logger = require("./core/logger");

const AN_HOUR_AGO = 3600000;
const EVERY_HOUR = "0 * * * *";

logger.info(`Cleaning queues...`);
Promise.all([readabilityQueue.clean(AN_HOUR_AGO), feedsQueue.clean(AN_HOUR_AGO)])
  .then(() => {
    logger.info(`Cleaning repeatable jobs...`);
    feedsQueue.getRepeatableJobs();
  })
  .then(jobs => {
    for (let job of jobs) {
      const { name, cron } = job;
      logger.info(`Remove "${name}" (cron: ${cron})`);
      feedsQueue.removeRepeatable(name, { repeat: { cron } });
    }
  })
  .then(() => {
    logger.info(`Scheduling "${FEEDS_UPDATE}" (cron: ${EVERY_HOUR})`);
    feedsQueue.add(FEEDS_UPDATE, {}, { repeat: { cron: EVERY_HOUR } });
  })
  .catch(error => logger.error(error));