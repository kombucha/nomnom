const uuid = require("node-uuid");

const db = require("./db");
const dbInsert = require("./utils/dbInsert");
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

  await db.query(...dbInsert("UserEntry", userEntry));

  return userEntry;
};

api.getFromUrl = async function(url) {
  const res = await db.query(
    `SELECT "UserEntry".*
     FROM "UserEntry" "UserEntry" INNER JOIN "Entry" "Entry" ON ("UserEntry"."EntryId" = "Entry"."id")
     WHERE "Entry"."url" = $1`,
    [url]
  );

  return res.rows[0];
};

api.list = async function(userId, options) {
  const filters = [`"UserId" = $1`];
  const filtersParams = [userId, options.limit];

  if (options.status) {
    filters.push(`"status" = $3`);
    filtersParams.push(options.status);
  }

  if (options.beforeCreationDate) {
    filters.push(`"creationDate" < $4`);
    filtersParams.push(options.beforeCreationDate);
  }

  const res = await db.query(
    `
    SELECT * FROM "UserEntry"
    WHERE ${filters.join(" AND ")}
    ORDER BY "creationDate" DESC
    LIMIT $2
  `,
    filtersParams
  );

  return res.rows;
};

api.count = async function(userId, status) {
  const filters = [`"UserId" = $1`];
  const filtersParams = [userId];

  if (status) {
    filters.push(`"status" = $2`);
    filtersParams.push(status);
  }

  const res = await db.query(
    `SELECT COUNT(*) FROM "UserEntry" WHERE ${filters.join(" AND ")}`,
    filtersParams
  );

  return res.rows[0].count;
};

const UPDATABLE_KEYS = ["status", "tags", "progress"];
api.batchUpdate = async function(userEntryIds, updateValues) {
  const updates = [];
  const params = [new Date(), ...userEntryIds];
  const varOffset = params.length + 1;
  UPDATABLE_KEYS.forEach(key => {
    if (Object.hasOwnProperty.call(updateValues, key)) {
      updates.push(`"${key}" = $${updates.length + varOffset}`);
      params.push(updateValues[key]);
    }
  });

  let results;

  try {
    if (userEntryIds.length === 1) {
      results = await db.query(
        `UPDATE "UserEntry"
       SET "lastUpdateDate" = $1,
       ${updates.join(", ")}
       WHERE "id" = $2
       RETURNING "UserEntry".*;
      `,
        params
      );
    } else {
      const idsPlaceholders = userEntryIds.map((_, idx) => `$${idx + 2}`);
      results = await db.query(
        `UPDATE "UserEntry"
       SET "lastUpdateDate" = $1,
       ${updates.join(", ")}
       WHERE "id" IN (${idsPlaceholders.join(",")})
       RETURNING "UserEntry".*;
      `,
        params
      );
    }
  } catch (e) {
    logger.error(e);
    return null;
  }

  return results.rows;
};

api.update = async function(userEntryId, updateValues) {
  const userEntries = await api.batchUpdate([userEntryId], updateValues);
  return userEntries[0];
};

api.deleteAll = async function(userId) {
  try {
    await db.query(
      `DELETE FROM "UserEntry"
       WHERE "UserId" = $1`,
      [userId]
    );
  } catch (e) {
    return false;
  }

  return true;
};

module.exports = api;
