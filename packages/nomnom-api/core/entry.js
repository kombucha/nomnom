const uuid = require("node-uuid");

const { queue: readabilityQueue, READABILITY_JOB } = require("../jobs/readability/queue");
const logger = require("./logger");
const db = require("./db");

const READABILITY_CONFIG = {
  youtubeApiKey: process.env.YOUTUBE_API_KEY,
  imageFilePath: process.env.IMAGES_PATH,
  imageBaseUrl: "/img/"
};

const READABILITY_JOB_OPTS = { attempts: 3, removeOnComplete: true, timeout: 60000, backoff: 100 };

// TODO: handle multiple types of entries (only generic "article" behavior now)
async function createFromUrl(url) {
  const entryFromDb = await getFromUrl(url);

  if (entryFromDb) {
    logger.info(`Hurray, an entry already exists for ${url}`);
    return entryFromDb;
  }

  const readabilityJob = await readabilityQueue.add(
    READABILITY_JOB,
    { url, config: READABILITY_CONFIG },
    READABILITY_JOB_OPTS
  );
  const readabilityResult = await readabilityJob.finished();

  const entry = Object.assign({}, readabilityResult, {
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
