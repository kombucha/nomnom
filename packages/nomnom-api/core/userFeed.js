const uuid = require("node-uuid");

const db = require("./db");
const { updateOne } = require("./utils/dbUpdate");
const dbInsert = require("./utils/dbInsert");
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

  await db.query(...dbInsert("UserFeed", userFeed));

  return userFeed;
}

async function update(feedId, data) {
  const allowedFields = ["name", "enabled"];
  const updateArgs = updateOne("UserFeed", feedId, data, allowedFields);

  const results = await db.query(...updateArgs);

  return results.rows[0];
}

async function list(userId) {
  const res = await db.query(
    `
    SELECT * FROM "UserFeed"
    WHERE "UserId" = $1
    ORDER BY "creationDate" DESC
  `,
    [userId]
  );

  return res.rows;
}

async function listUsersForFeed(feedId) {
  const res = await db.query(
    `SELECT "User".*
     FROM "User" "User"
      INNER JOIN "UserFeed" "UserFeed"
      ON ("User"."id" = "UserFeed"."UserId")
     WHERE "UserFeed"."FeedId" = $1
     LIMIT 1`,
    [feedId]
  );

  return res.rows;
}

module.exports = { create, update, list, listUsersForFeed };
