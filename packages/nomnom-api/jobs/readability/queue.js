const path = require("path");
const Queue = require("bull");

const READABILITY_JOB = "readability";

function create(isWorker = true) {
  const readabilityQueue = new Queue("readability", process.env.REDIS_URL);

  if (isWorker) {
    const readabilityProcessorPath = path.resolve(__dirname, "./processor.js");
    readabilityQueue.process(READABILITY_JOB, 2, readabilityProcessorPath);
  }

  return readabilityQueue;
}

module.exports = { READABILITY_JOB, create };
