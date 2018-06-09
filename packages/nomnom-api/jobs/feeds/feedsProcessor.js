const logger = require("../../core/logger");
const feedService = require("../../core/feed");

const feedsQueue = require("./queue");
const { queueAsync } = require("../utils");

async function feedsProcessor() {
  const feeds = await feedService.getAll();

  logger.info(`Scheduling ${feeds.length} feed updates`);
  await queueAsync(
    feedsQueue.create,
    feeds.map(feed => ({
      name: feedsQueue.FEED_UPDATE,
      data: { feed },
      options: { attempts: 3 }
    }))
  );
}

module.exports = feedsProcessor;
