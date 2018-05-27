const readability = require("../../core/readability");
const logger = require("../../core/logger");

function readabilityProcessor(job) {
  const { url, config } = job.data;
  logger.info(
    `Running readability job on "${url}"  [id: ${job.id}] [attempt: ${job.attemptsMade + 1}] `
  );

  return readability(url, config);
}

module.exports = readabilityProcessor;
