const path = require("path");
const Queue = require("bull");

const READABILITY_JOB = "readability";

const readabilityQueue = new Queue("readability", process.env.REDIS_URL);
const readabilityProcessorPath = path.resolve(__dirname, "./processor.js");
readabilityQueue.process(READABILITY_JOB, 5, readabilityProcessorPath);

module.exports = { READABILITY_JOB, queue: readabilityQueue };
