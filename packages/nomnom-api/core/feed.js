const uuid = require("node-uuid");
const clamp = require("lodash/clamp");

const db = require("./db");
const logger = require("./logger");

const FEED_TYPES = {
  RSS: "RSS"
};
const MIN_FREQUENCY = 3600 * 1000;
const MAX_FREQUENCY = 24 * 3600 * 1000;

const api = { MIN_FREQUENCY, MAX_FREQUENCY };

api.getAll = async function() {
  const feeds = await db("Feed");
  return feeds;
};

// TODO: transactions ?
api.createFromUri = async function(uri) {
  logger.info(`Creating feed ${uri}`);

  const existingFeed = await api.getFromUri(uri);

  if (existingFeed) {
    logger.info(`Feed ${uri} already exists`);
    return existingFeed;
  }

  const feed = {
    id: uuid.v4(),
    creationDate: new Date(),
    uri,
    type: FEED_TYPES.RSS
  };

  await db("Feed").insert(feed);

  return feed;
};

api.update = async function(id, data) {
  await db("Feed")
    .where("id", id)
    .update(data);

  const updatedFeed = await db("Feed")
    .where("id", id)
    .first();

  return updatedFeed;
};

api.updateFeedMetadata = async function(feed, entries) {
  const lastUpdateDate = new Date();
  let updateFrequency = MIN_FREQUENCY;

  const publicationDates = entries
    .filter(e => !!e.published)
    .map(e => new Date(e.published).getTime())
    .sort((a, b) => (a - b > 0 ? 1 : -1));

  if (publicationDates.length > 2) {
    let distancesSum = 0;

    for (let i = 0; i < publicationDates.length - 1; i++) {
      distancesSum += publicationDates[i + 1] - publicationDates[i];
    }

    const average = distancesSum / (publicationDates.length - 1);
    updateFrequency = Math.round(clamp(average, MIN_FREQUENCY, MAX_FREQUENCY));
  }

  await api.update(feed.id, { lastUpdateDate, updateFrequency });
};

api.getFromUri = async function(uri) {
  const feed = await db("Feed")
    .where("uri", uri)
    .first();

  return feed;
};

api.getById = async function(id) {
  const feed = await db("Feed")
    .where("id", id)
    .first();

  return feed;
};

module.exports = api;
