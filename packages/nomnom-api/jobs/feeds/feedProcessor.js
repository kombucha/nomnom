const Promise = require("bluebird");
const moment = require("moment");

const logger = require("../../core/logger");
const userFeedService = require("../../core/userFeed");
const feedService = require("../../core/feed");
const userEntryService = require("../../core/userEntry");

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
  return Promise.each(entries, async entry => {
    try {
      await userEntryService.create(userId, { url: entry.url, status: "NEW" }, entry);
    } catch (error) {
      logger.error("Failed to create user entry while processing feed");
      logger.error(error);
    }
  });
}

async function feedProcessor(job) {
  const { feedId } = job.data;
  let feed;

  try {
    feed = await feedService.getById(feedId);
    logger.info(`Processing feed ${feed.uri}`);
    await job.progress(10);

    if (feed.updateFrequency && Date.now() - feed.lastUpdateDate < feed.updateFrequency) {
      const frequency = moment.duration(feed.updateFrequency, "ms").humanize();
      logger.info(
        `Skip feed ${feed.uri} because it's been updated recently enough. (freq: ${frequency})`
      );
      return;
    }

    const users = await userFeedService.listUsersForFeed(feed.id);
    await job.progress(25);

    if (users.length === 0) {
      logger.info(`Skip feed ${feed.uri} because no one cares about it :(`);
      return;
    }

    const entries = await getFeedEntries(feed);
    await job.progress(50);

    await feedService.updateFeedMetadata(feed, entries);
    await job.progress(75);

    await Promise.each(users, user => createForUser(user.id, entries));
  } catch (error) {
    logger.error(`Failed to process feed ${feed ? feed.uri : feedId}`);
    logger.error(error.stack);

    throw error;
  }
}

module.exports = feedProcessor;
