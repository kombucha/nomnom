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
    // TODO: return an error ?
    logger.info(`A user entry already existing for ${userEntryParam.url} for user ${userId}`);
    return existingEntry;
  }

  const newEntry = await entry.createFromUrl(userEntryParam.url);
  const userEntry = {
    id: uuid.v4(),
    user: userId,
    entry: newEntry.id,
    creationDate: userEntryParam.creationDate ? new Date(userEntryParam.creationDate) : new Date(),
    lastUpdateDate: null,
    progress: 0,
    status: userEntryParam.status || USER_ENTRY_STATE.LATER,
    tags: userEntryParam.tags || []
  };

  await db.query(
    `INSERT INTO
    "nomnom"."UserEntry"("id", "UserId", "EntryId", "creationDate", "lastUpdateDate", "progress", "status", "tags")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      userEntry.id,
      userEntry.user,
      userEntry.entry,
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
     FROM "nomnom"."UserEntry" "UserEntry" INNER JOIN "nomnom"."Entry" "Entry" ON ("UserEntry"."EntryId" = "Entry"."id")
     WHERE "Entry"."url" = $1`,
    [url]
  );

  return res.rows[0];
}

// TODO: pagination ???
async function list(userId, options) {
  const filters = [`"UserId" = $1`];
  const filtersParams = [userId];

  if (options.status) {
    filters.push(`"status" = $2`);
    filtersParams.push(options.status);
  }

  const res = await db.query(
    `
    SELECT * FROM "nomnom"."UserEntry"
    WHERE ${filters.join(" AND ")}
     ORDER BY "creationDate" DESC
  `,
    filtersParams
  );

  return res.rows;
}

const UPDATABLE_KEYS = ["status", "tags", "progress"];
async function update(userEntryId, updateValues) {
  const updates = [];
  const params = [userEntryId, new Date()];
  UPDATABLE_KEYS.forEach(key => {
    if (updateValues[key]) {
      updates.push(`"${key}" = $${updates.length + 3}`);
      params.push(updateValues[key]);
    }
  });

  try {
    await db.query(
      `UPDATE "nomnom"."UserEntry"
       SET "lastUpdateDate" = $2,
       ${updates.join(", ")}
       WHERE "id" = $1;
      `,
      params
    );
  } catch (e) {
    return false;
  }

  return true;
}

async function deleteAll(userId) {
  try {
    await db.query(
      `DELETE FROM "nomnom"."UserEntry"
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
  deleteAll
};
