const uuid = require("node-uuid");

const db = require("./db");
const logger = require("./logger");

const FEED_TYPES = {
  RSS: "RSS"
};

async function getAll() {
  const res = await db.query(`SELECT * FROM "Feed"`);
  return res.rows;
}

// TODO: transactions ?
async function createFromUri(uri) {
  logger.info(`Creating feed ${uri}`);

  const existingFeed = await getFromUri(uri);

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
}

async function getFromUri(uri) {
  const res = await db.query(
    `SELECT *
     FROM "Feed"
     WHERE "uri" = $1
     LIMIT 1`,
    [uri]
  );

  return res.rows[0];
}

module.exports = { getAll, createFromUri };
