const uuid = require("node-uuid");
const N1qlQuery = require("couchbase").N1qlQuery;

const db = require("../couchbase");
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
function createFromUrl(userId, url) {
  const id = generateId(userId);

  return entry.createFromUrl(url).then(entry => {
    const userEntry = {
      user: userId,
      entry: entry.id,
      creationDate: Date.now(),
      lastUpdateDate: null,
      progress: 0,
      status: USER_ENTRY_STATE.LATER,
      tags: []
    };

    return db
      .insert(id, userEntry)
      .then(() => Object.assign({ id }, userEntry));
  });
}

// TODO: pagination ???
function getUserEntries(userId, options) {
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

module.exports = {
  DB_TYPE,
  USER_ENTRY_STATE,
  createFromUrl,
  getUserEntries
};
