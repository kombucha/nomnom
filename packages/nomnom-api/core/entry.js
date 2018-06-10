const uuid = require("node-uuid");

const readabilityQueue = require("../jobs/readability/queue");
const { performAsync } = require("../jobs/utils");
const logger = require("./logger");
const db = require("./db");
const dbInsert = require("./utils/dbInsert");
const readabilityConfig = require("./readabilityConfig");

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
      data: { url, config: readabilityConfig },
      options: { ...READABILITY_JOB_OPTIONS, jobId: url }
    }
  ]);

  const entry = Object.assign({}, entryParam, readabilityResult, {
    id: uuid.v4(),
    creationDate: new Date(),
    url
  });

  await db.query(...dbInsert("Entry", entry));

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
  createFrom,
  getFromUrl
};
