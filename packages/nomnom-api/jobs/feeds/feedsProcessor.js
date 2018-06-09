const logger = require("../../core/logger");
const feedService = require("../../core/feed");

const feedsQueue = require("./queue");
const { queueAsync } = require("../utils");

const TEN_MIN_IN_MS = 10 * 60 * 1000;
const TEN_S_IN_MS = 10 * 1000;

async function feedsProcessor() {
  const feeds = await feedService.getAll();

  logger.info(`Scheduling ${feeds.length} feed updates`);
  await queueAsync(
    feedsQueue.create,
    feeds.map(feed => ({
      name: feedsQueue.FEED_UPDATE,
      data: { feedId: feed.id },
      options: {
        attempts: 3,
        removeOnComplete: true,
        timeout: TEN_MIN_IN_MS,
        backoff: { type: "fixed", delay: TEN_S_IN_MS }
      }
    }))
  );
}

module.exports = feedsProcessor;
