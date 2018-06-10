const uuid = require("node-uuid");
const clamp = require("lodash/clamp");

const db = require("./db");
const logger = require("./logger");
const { updateOne } = require("./utils/dbUpdate");
const dbInsert = require("./utils/dbInsert");

const FEED_TYPES = {
  RSS: "RSS"
};
const MIN_FREQUENCY = 3600 * 1000;
const MAX_FREQUENCY = 24 * 3600 * 1000;

const api = { MIN_FREQUENCY, MAX_FREQUENCY };

api.getAll = async function() {
  const res = await db.query(`SELECT * FROM "Feed"`);
  return res.rows;
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

  await db.query(...dbInsert("Feed", feed));

  return feed;
};

api.update = async function(id, data) {
  const updateArgs = updateOne("Feed", id, data);
  const results = await db.query(...updateArgs);
  return results.rows[0];
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
  const res = await db.query(
    `SELECT *
     FROM "Feed"
     WHERE "uri" = $1
     LIMIT 1`,
    [uri]
  );

  return res.rows[0];
};

api.getById = async function(id) {
  const res = await db.query(
    `SELECT *
     FROM "Feed"
     WHERE "id" = $1
     LIMIT 1`,
    [id]
  );

  return res.rows[0];
};

module.exports = api;
