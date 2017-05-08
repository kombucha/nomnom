const db = require("./db");

async function list(userId) {
  const res = await db.query(
    `
    SELECT * FROM "nomnom"."UserFeed"
    WHERE "UserId" = $1
    ORDER BY "creationDate" DESC
  `,
    [userId]
  );

  return res.rows;
}

module.exports = { list };
