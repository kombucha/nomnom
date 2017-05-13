const uuid = require("node-uuid");
const db = require("./db");
const logger = require("./logger");
const feedService = require("./feed");

async function create(userId, userFeedParam) {
  logger.info(`Creating feed ${userFeedParam.name} for user ${userId}`);

  const newFeed = await feedService.createFromUri(userFeedParam.uri);
  const userFeed = {
    id: uuid.v4(),
    user: userId,
    feed: newFeed.id,
    name: userFeedParam.name,
    creationDate: new Date(),
    enabled: true
  };

  await db.query(
    `
    INSERT INTO
    "nomnom"."UserFeed"("id", "UserId", "FeedId", "name", "creationDate", "enabled")
    VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      userFeed.id,
      userFeed.user,
      userFeed.feed,
      userFeed.name,
      userFeed.creationDate,
      userFeed.enabled
    ]
  );

  return userFeed;
}

async function list(userId) {
  const res = await db.query(
    `
    SELECT * FROM "nomnom"."UserFeed"
    WHERE "UserId" = $1
    ORDER BY "creationDate" DESC
  `,
    [userId]
  );

  return res.rows;
}

module.exports = { create, list };
