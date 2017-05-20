const Promise = require("bluebird");

const logger = require("../../services/logger");
const feedService = require("../../services/feed");
const userFeedService = require("../../services/userFeed");
const userEntryService = require("../../services/userEntry");
const rss = require("./rss");

async function getFeedEntries(feed) {
  switch (feed.type) {
    case "RSS":
      return rss.getFeedEntries(feed.uri);
    default:
      return Promise.reject("Not yet implemented");
  }
}

async function createForUser(userId, entries) {
  // TODO: optimize creation call: don't need to check for existing entry with url, when I know it exists.
  return Promise.each(entries, entry => userEntryService.create(userId, entry));
}

async function processFeed(feed) {
  logger.info(`Processing feed ${feed.uri}`);

  try {
    const entries = await getFeedEntries(feed);
    const users = await userFeedService.listUsersForFeed(feed.id);
    await Promise.each(users, user => createForUser(user.id, entries));
  } catch (error) {
    logger.error(`Failed to process feed ${feed.uri}`, error);
  }
}

/**
 * Check all feeds, create entries for the feed, create userentries for users subscribed to
 * the respective feeds.
 * Feeds -> Entries -> UserEntry
 */
async function updateFeeds() {
  const feeds = await feedService.getAll();
  await Promise.mapSeries(feeds, processFeed);
}

module.exports = updateFeeds;
