const { queue: feedsQueue, FEEDS_UPDATE } = require("./jobs/updateFeeds/queue");
const logger = require("./core/logger");

const EVERY_HOUR = "0 * * * *";

feedsQueue
  .getRepeatableJobs()
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
