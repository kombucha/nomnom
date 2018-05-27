const logger = require("../../core/logger");
const feedService = require("../../core/feed");

const { queue, FEED_UPDATE } = require("./queue");

async function feedsProcessor() {
  const feeds = await feedService.getAll();

  logger.info(`Scheduling ${feeds.length} feed updates`);
  feeds.forEach(feed => {
    queue.add(FEED_UPDATE, { feed }, { attempts: 3 });
  });
}

module.exports = feedsProcessor;
