const uuid = require("node-uuid");
const db = require("../couchbase");
const readability = require("./readability");

const DB_TYPE = "ENTRY";
const generateId = () => `${DB_TYPE}::${uuid.v4()}`;

// TODO: handle deduplication (createOrUpdate-like behavior ?)
// TODO: handle multiple types of entries (only generic "article" behavior now)
function createFromUrl(url) {
  const id = generateId();
  const baseEntry = Object.assign({
    creationDate: Date.now(),
    url
  });

  return readability(url)
    .then(entry => Object.assign(baseEntry, entry))
    .then(entry => db.insert(id, entry))
    .then(entry => Object.assign({ id }, entry));
}

module.exports = {
  createFromUrl
};
