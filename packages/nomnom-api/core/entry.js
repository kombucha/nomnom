const uuid = require("node-uuid");
const logger = require("./logger");
const db = require("./db");
const readability = require("./readability");

const READABILITY_CONFIG = {
  youtubeApiKey: process.env.YOUTUBE_API_KEY,
  imageFilePath: process.env.IMAGES_PATH,
  imageBaseUrl: "/img/"
};

// TODO: handle multiple types of entries (only generic "article" behavior now)
async function createFromUrl(url) {
  const entryFromDb = await getFromUrl(url);

  if (entryFromDb) {
    logger.info(`Hurray, an entry already exists for ${url}`);
    return entryFromDb;
  }

  const entry = Object.assign({}, await readability(url, READABILITY_CONFIG), {
    id: uuid.v4(),
    creationDate: new Date(),
    url
  });

  await db.query(
    `
    INSERT INTO "Entry"("id", "url", "title", "originalContent",
    "creationDate", "publicationDate", "author", "excerpt", "content", "imageUrl", "duration")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  `,
    [
      entry.id,
      entry.url,
      entry.title,
      entry.originalContent,
      entry.creationDate,
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
     FROM "Entry"
     WHERE "url" = $1
     LIMIT 1`,
    [url]
  );

  return res.rows[0];
}

module.exports = {
  createFromUrl
};
