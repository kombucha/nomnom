const uuid = require("node-uuid");
const N1qlQuery = require("couchbase").N1qlQuery;
const db = require("./couchbase");
const readability = require("./readability");

const DB_TYPE = "ENTRY";
const generateId = () => `${DB_TYPE}::${uuid.v4()}`;

// TODO: handle multiple types of entries (only generic "article" behavior now)
async function createFromUrl(url) {
  const entryFromDb = await getFromUrl(url);

  if (entryFromDb) {
    return entryFromDb;
  }

  const id = generateId();
  const baseEntry = Object.assign({
    creationDate: Date.now(),
    url
  });

  let entry = await readability(url);
  entry = Object.assign(baseEntry, entry);
  await db.insert(id, entry);
  return Object.assign({ id }, entry);
}

async function getFromUrl(url) {
  const idLike = `${DB_TYPE}::%`;
  const query = N1qlQuery.fromString(
    `
    SELECT meta(t).id, t.*
    FROM \`nomnom\` as t
    WHERE meta(t).id LIKE $1
    AND t.url = $2
    `
  );

  const entries = await db.query(query, [idLike, url]);

  return entries[0];
}

module.exports = {
  createFromUrl
};
