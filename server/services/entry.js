const uuid = require("node-uuid");
const db = require("./db");
const readability = require("./readability");

// TODO: handle multiple types of entries (only generic "article" behavior now)
async function createFromUrl(url) {
  const entryFromDb = await getFromUrl(url);

  if (entryFromDb) {
    return entryFromDb;
  }

  const entry = Object.assign({}, await readability(url), {
    id: uuid.v4(),
    creationDate: Date.now(),
    url
  });

  await db.query(
    `
    INSERT INTO "nomnom"."Entry"("id", "url", "title", "originalContent",
    "creationDate", "publicationDate", "author", "excerpt", "content", "imageUrl", "duration")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  `,
    [
      entry.id,
      entry.url,
      entry.title,
      entry.originalContent,
      new Date(entry.creationDate),
      new Date(entry.publicationDate),
      entry.author,
      entry.excerpt,
      entry.content,
      entry.imageUrl,
      entry.duration
    ]
  );

  return entry;
}

async function getFromUrl(url) {
  const res = await db.query(
    `SELECT *
     FROM "nomnom"."Entry"
     WHERE "url" = $1
     LIMIT 1`,
    [url]
  );

  return res.rows[0];
}

module.exports = {
  createFromUrl
};
