const uuid = require("node-uuid");

const db = require("./db");
const logger = require("./logger");
const clamp = require("lodash/clamp");

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

  await db.query(
    `
    INSERT INTO "Feed"("id", "creationDate", "uri", "type")
    VALUES ($1, $2, $3, $4);
    `,
    [feed.id, feed.creationDate, feed.uri, feed.type]
  );

  return feed;
};

api.update = async function(id, data) {
  let updates = [];
  let values = [id];
  let idx = 2;
  for (let [column, value] of Object.entries(data)) {
    updates.push(`"${column}" = $${idx++}`);
    values.push(value);
  }

  const results = await db.query(
    `
    UPDATE "Feed"
    SET ${updates.join(", ")}
    WHERE "id" = $1
    RETURNING "Feed".*;
  `,
    values
  );

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
    updateFrequency = clamp(average, MIN_FREQUENCY, MAX_FREQUENCY);
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

module.exports = api;
