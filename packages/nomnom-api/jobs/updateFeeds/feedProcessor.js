const Promise = require("bluebird");

const logger = require("../../core/logger");
const userFeedService = require("../../core/userFeed");
const userEntryService = require("../../core/userEntry");

const rss = require("./rss");

// const { queue, FEED_UPDATE } = require("./feedsQueue");

async function getFeedEntries(feed) {
  switch (feed.type) {
    case "RSS":
      return rss.getFeedEntries(feed.uri);
    default:
      return Promise.reject("Not yet implemented");
  }
}

async function createForUser(userId, entries) {
  return Promise.each(entries, async entry => {
    try {
      await userEntryService.create(userId, { url: entry.url, status: "NEW" });
    } catch (error) {
      logger.error("Failed to create user entry while processing feed");
      logger.error(error);
    }
  });
}

async function feedProcessor(job) {
  const { feed } = job.data;

  logger.info(`Processing feed ${feed.uri}`);

  try {
    const users = await userFeedService.listUsersForFeed(feed.id);

    if (users.length === 0) {
      logger.info(`Skip feed because no one cares about it :(`);
      return;
    }

    const entries = await getFeedEntries(feed);
    await Promise.each(users, user => createForUser(user.id, entries));
  } catch (error) {
    logger.error(`Failed to process feed ${feed.uri}`);
    logger.error(error);
  }
}

module.exports = feedProcessor;
