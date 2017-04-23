const uuid = require("node-uuid");
const N1qlQuery = require("couchbase").N1qlQuery;

const db = require("./couchbase");
const entry = require("./entry");

const DB_TYPE = "USER_ENTRY";
const generateId = userId => `${DB_TYPE}::${userId}::${uuid.v4()}`;

const USER_ENTRY_STATE = {
  NEW: "NEW",
  LATER: "LATER",
  FAVORITE: "FAVORITE",
  ARCHIVED: "ARCHIVED"
};

// TODO: source (rss, user etc)
async function createFromUrl(userId, url) {
  const id = generateId(userId);

  const newEntry = await entry.createFromUrl(url);
  const userEntry = {
    user: userId,
    entry: newEntry.id,
    creationDate: Date.now(),
    lastUpdateDate: null,
    progress: 0,
    status: USER_ENTRY_STATE.LATER,
    tags: []
  };
  await db.insert(id, userEntry);

  return Object.assign({ id }, userEntry);
}

// TODO: pagination ???
function list(userId, options) {
  const userEntriesIdLike = `USER_ENTRY::${userId}::%`;
  const filters = ["meta(t).id LIKE $1"];
  const filtersParams = [userEntriesIdLike];

  if (options.status) {
    filters.push("t.status = $2");
    filtersParams.push(options.status);
  }

  const query = N1qlQuery.fromString(
    `
    SELECT meta(t).id, t.*
    FROM \`nomnom\` as t
    WHERE ${filters.join(" AND ")}
    ORDER BY t.creationDate DESC
    `
  );

  return db.query(query, filtersParams);
}

const UPDATABLE_KEYS = ["status", "tags", "progress"];
function update(userEntryId, updateValues) {
  let mutationBuilder = db.mutateIn(userEntryId);

  mutationBuilder = UPDATABLE_KEYS.reduce(
    (mutationBuilder, key) => {
      return updateValues[key]
        ? mutationBuilder.replace(key, updateValues[key])
        : mutationBuilder;
    },
    mutationBuilder
  );

  return mutationBuilder.execute();
}

function deleteAll(userId) {
  const userEntriesIdLike = `USER_ENTRY::${userId}::%`;
  const query = N1qlQuery.fromString(
    `
    DELETE FROM \`nomnom\` as t
    WHERE meta(t).id LIKE $1
    `
  );

  return db.query(query, [userEntriesIdLike]);
}

module.exports = {
  DB_TYPE,
  USER_ENTRY_STATE,

  createFromUrl,
  list,
  update,
  deleteAll
};
