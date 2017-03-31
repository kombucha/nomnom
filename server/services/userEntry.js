const uuid = require("node-uuid");
const N1qlQuery = require("couchbase").N1qlQuery;

const db = require("../couchbase");
const entry = require("./entry");

const DB_TYPE = "USER_ENTRY";
const generateId = userId => `${DB_TYPE}::${userId}::${uuid.v4()}`;

const USER_ENTRY_STATE = {
  NEW: "NEW",
  LATER: "LATER",
  ARCHIVED: "ARCHIVED"
};

// TODO: source (rss, user etc)
function createFromUrl(userId, url) {
  const id = generateId(userId);

  return entry
    .createFromUrl(url)
    .then(entry => {
      const userEntry = {
        user: userId,
        entry: entry.id,
        creationDate: Date.now(),
        lastUpdateDate: null,
        progress: 0,
        state: USER_ENTRY_STATE.LATER,
        favorite: false,
        tags: []
      };

      return db.insert(id, userEntry);
    })
    .then(userEntry => Object.assign({ id }, userEntry));
}

// TODO: pagination ???
function getUserEntries(userId) {
  const userEntriesIdLike = `USER_ENTRY::${userId}::%`;
  const query = N1qlQuery.fromString(
    "SELECT meta(t).id, t.* FROM `nomnom` as t WHERE meta(t).id LIKE $1"
  );
  return db.query(query, [userEntriesIdLike]);
}

module.exports = {
  USER_ENTRY_STATE,
  createFromUrl,
  getUserEntries
};
