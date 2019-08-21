const uuid = require("node-uuid");

const readabilityQueue = require("../jobs/readability/queue");
const { performAsync } = require("../jobs/utils");
const logger = require("./logger");
const db = require("./db");
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

  const mergedResult = { ...entryParam, ...readabilityResult };
  const entry = Object.assign({}, mergedResult, {
    id: uuid.v4(),
    creationDate: new Date(),
    publicationDate: mergedResult.publicationDate
      ? new Date(mergedResult.publicationDate)
      : undefined,
    url
  });

  await db("Entry").insert(entry);

  return entry;
}

async function getFromUrl(url) {
  const entry = await db("Entry")
    .where("url", url)
    .first();

  return entry;
}

module.exports = {
  createFrom,
  getFromUrl
};
