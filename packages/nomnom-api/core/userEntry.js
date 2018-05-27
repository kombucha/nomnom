const uuid = require("node-uuid");

const db = require("./db");
const entry = require("./entry");
const logger = require("./logger");

const USER_ENTRY_STATE = {
  NEW: "NEW",
  LATER: "LATER",
  FAVORITE: "FAVORITE",
  ARCHIVED: "ARCHIVED"
};

// TODO: source (rss, user etc)
async function create(userId, userEntryParam) {
  logger.debug(`Importing ${userEntryParam.url} for user ${userId}`);

  const existingEntry = await getFromUrl(userEntryParam.url);

  if (existingEntry) {
    return existingEntry;
  }

  const newEntry = await entry.createFromUrl(userEntryParam.url);
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

  await db.query(
    `INSERT INTO
    "UserEntry"("id", "UserId", "EntryId", "creationDate", "lastUpdateDate", "progress", "status", "tags")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      userEntry.id,
      userEntry.UserId,
      userEntry.EntryId,
      userEntry.creationDate,
      userEntry.lastUpdateDate,
      userEntry.progress,
      userEntry.status,
      userEntry.tags
    ]
  );

  return userEntry;
}

async function getFromUrl(url) {
  const res = await db.query(
    `SELECT "UserEntry".*
     FROM "UserEntry" "UserEntry" INNER JOIN "Entry" "Entry" ON ("UserEntry"."EntryId" = "Entry"."id")
     WHERE "Entry"."url" = $1`,
    [url]
  );

  return res.rows[0];
}

async function list(userId, options) {
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
}

const UPDATABLE_KEYS = ["status", "tags", "progress"];
async function update(userEntryId, updateValues) {
  const userEntries = await batchUpdate([userEntryId], updateValues);
  return userEntries[0];
}

async function batchUpdate(userEntryIds, updateValues) {
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
}

async function deleteAll(userId) {
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
}

module.exports = {
  USER_ENTRY_STATE,

  create,
  list,
  update,
  batchUpdate,
  deleteAll
};
