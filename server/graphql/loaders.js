const DataLoader = require("dataloader");
const db = require("../services/db");

const placeholders = count => Array(count).fill().map((_, idx) => `$${idx + 1}`);

const tableLoader = tableName =>
  async ids => {
    const res = await db.query(
      `
    SELECT * FROM "nomnom"."${tableName}"
    WHERE "id" IN (${placeholders(ids.length).join(", ")});`,
      ids
    );

    return res.rows;
  };

module.exports = () => ({
  userEntry: new DataLoader(tableLoader("UserEntry")),
  entry: new DataLoader(tableLoader("Entry")),
  user: new DataLoader(tableLoader("User"))
});
