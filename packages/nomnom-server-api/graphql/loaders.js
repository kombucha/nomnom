const DataLoader = require("dataloader");
const db = require("nomnom-server-core/db");

const placeholders = count =>
  Array(count).fill().map((_, idx) => `$${idx + 1}`);

const tableLoader = tableName => async ids => {
  const res = await db.query(
    `
      SELECT * FROM "nomnom"."${tableName}"
      WHERE "id" IN (${placeholders(ids.length).join(", ")});`,
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
