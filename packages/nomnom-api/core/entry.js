const uuid = require("node-uuid");

const readabilityQueue = require("../jobs/readability/queue");
const performAsync = require("../jobs/performAsync");
const logger = require("./logger");
const db = require("./db");

const READABILITY_CONFIG = {
  youtubeApiKey: process.env.YOUTUBE_API_KEY,
  imageFilePath: process.env.DATA_PATH,
  imageBaseUrl: process.env.IMG_BASE_URL
};

const READABILITY_JOB_OPTIONS = {
  attempts: 3,
  removeOnComplete: true,
  timeout: 60000,
  backoff: 100
};
const performReadability = performAsync.bind(null, readabilityQueue.create);

// TODO: handle multiple types of entries (only generic "article" behavior now)
async function createFrom(url, entryParam = {}) {
  const entryFromDb = await getFromUrl(url);

  if (entryFromDb) {
    logger.info(`Hurray, an entry already exists for ${url}`);
    return entryFromDb;
  }

  const [readabilityResult] = await performReadability([
    {
      name: readabilityQueue.READABILITY_JOB,
      data: { url, config: READABILITY_CONFIG },
      options: { ...READABILITY_JOB_OPTIONS, jobId: url }
    }
  ]);

  const entry = Object.assign({}, entryParam, readabilityResult, {
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
  createFrom
};
