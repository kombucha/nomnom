const DataLoader = require("dataloader");

const db = require("../core/db");
const dbPlaceholders = require("../core/utils/dbPlaceholders");

const tableLoader = tableName => async ids => {
  const res = await db.query(
    `
      SELECT * FROM "${tableName}"
      WHERE "id" IN (${dbPlaceholders(ids.length)});`,
    ids
  );

  const resultsById = res.rows.reduce((acc, row) => {
    acc[row.id] = row;
    return acc;
  }, {});

  return ids.map(id => resultsById[id] || null);
};

module.exports = () => ({
  userEntry: new DataLoader(tableLoader("UserEntry")),
  entry: new DataLoader(tableLoader("Entry")),
  user: new DataLoader(tableLoader("User")),
  userFeed: new DataLoader(tableLoader("UserFeed")),
  feed: new DataLoader(tableLoader("Feed"))
});
