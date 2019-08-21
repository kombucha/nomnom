const uuid = require("node-uuid");
const pick = require("lodash/pick");

const db = require("./db");
const entry = require("./entry");
const logger = require("./logger");

const USER_ENTRY_STATE = {
  NEW: "NEW",
  LATER: "LATER",
  FAVORITE: "FAVORITE",
  ARCHIVED: "ARCHIVED"
};

const api = {
  USER_ENTRY_STATE
};

// TODO: source (rss, user etc)
api.create = async function(userId, userEntryParam, entryParam) {
  logger.debug(`Importing ${userEntryParam.url} for user ${userId}`);

  const existingEntry = await api.getFromUrl(userEntryParam.url);

  if (existingEntry) {
    return existingEntry;
  }

  const newEntry = await entry.createFrom(userEntryParam.url, entryParam);
  const userEntry = {
    id: uuid.v4(),
    UserId: userId,
    EntryId: newEntry.id,
    creationDate: userEntryParam.creationDate ? new Date(userEntryParam.creationDate) : new Date(),
    lastUpdateDate: null,
    progress: 0,
    status: userEntryParam.status || USER_ENTRY_STATE.LATER,
    tags: userEntryParam.tags || []
  };

  await db("UserEntry").insert({ ...userEntry, tags: JSON.stringify(userEntry.tags) });

  return userEntry;
};

api.getFromUrl = async function(url) {
  const userEntry = await db
    .from("UserEntry")
    .innerJoin("Entry", "UserEntry.EntryId", "Entry.id")
    .where("Entry.url", url)
    .first();

  return userEntry;
};

api.list = async function(userId, options) {
  let query = db("UserEntry")
    .orderBy("creationDate", "desc")
    .limit(options.limit)
    .where("UserId", userId);

  if (options.status) {
    query = query.andWhere("status", options.status);
  }

  if (options.beforeCreationDate) {
    query = query.andWhere("creationDate", "<", options.beforeCreationDate);
  }

  const userEntries = await query;

  return userEntries;
};

api.count = async function(userId, status) {
  const filters = { UserId: userId };

  if (status) {
    filters.status = status;
  }

  const result = await db("UserEntry")
    .where(filters)
    .count("id", { as: "count" })
    .first();

  return parseInt(result.count, 10);
};

const UPDATABLE_KEYS = ["status", "tags", "progress"];
api.batchUpdate = async function(userEntryIds, updateValues) {
  let updatedUserEntries = [];

  const updatePayload = {
    lastUpdateDate: new Date(),
    ...pick(updateValues, UPDATABLE_KEYS)
  };

  if (Array.isArray(updatePayload.tags)) {
    updatePayload.tags = JSON.stringify(updatePayload.tags);
  }

  try {
    await db("UserEntry")
      .whereIn("id", userEntryIds)
      .update();

    updatedUserEntries = await db("UserEntry").whereIn("id", userEntryIds);
  } catch (e) {
    logger.error(e);
  }

  return updatedUserEntries;
};

api.update = async function(userEntryId, updateValues) {
  const userEntries = await api.batchUpdate([userEntryId], updateValues);
  return userEntries[0];
};

api.deleteAll = async function(userId) {
  try {
    await db("UserEntry")
      .where("UserId", userId)
      .del();
  } catch (e) {
    return false;
  }

  return true;
};

module.exports = api;
