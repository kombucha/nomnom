const readability = require("../../core/readability");
const logger = require("../../core/logger");

function readabilityProcessor(job) {
  const { url, config } = job.data;
  logger.info(
    `Running readability job on "${url}"  [id: ${job.id}] [attempt: ${job.attemptsMade + 1}] `
  );

  return readability(url, config).catch(e => {
    logger.error(`Failed to run readability on ${url}`);
    logger.error(e.stack);
    throw e;
  });
}

module.exports = readabilityProcessor;
