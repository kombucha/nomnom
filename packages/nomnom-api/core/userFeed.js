const uuid = require("node-uuid");
const pick = require("lodash/pick");

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

  await db("UserFeed").insert(userFeed);

  return userFeed;
}

async function update(feedId, data) {
  const allowedFields = ["name", "enabled"];

  await db("UserFeed")
    .where("id", feedId)
    .update(pick(data, allowedFields));

  const updatedUserFeed = await db("UserFeed")
    .where("id", feedId)
    .first();

  return updatedUserFeed;
}

async function list(userId) {
  const userFeeds = await db("UserFeed")
    .where("UserId", userId)
    .orderBy("creationDate", "desc");

  return userFeeds;
}

async function listUsersForFeed(feedId) {
  const users = await db
    .from("User")
    .innerJoin("UserFeed", "UserFeed.UserId", "User.id")
    .where({ "UserFeed.FeedId": feedId, "UserFeed.enabled": true });

  return users;
}

module.exports = { create, update, list, listUsersForFeed };
