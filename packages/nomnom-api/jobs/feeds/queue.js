const path = require("path");
const Queue = require("bull");

const FEEDS_UPDATE = "feeds-update";
const FEED_UPDATE = "feed-update";

function create(isWorker = true) {
  const feedsQueue = new Queue("feeds", process.env.REDIS_URL);

  if (isWorker) {
    const feedsProcessorPath = path.resolve(__dirname, "./feedsProcessor.js");
    const feedProcessorPath = path.resolve(__dirname, "./feedProcessor.js");

    // Schedules feeds update
    feedsQueue.process(FEEDS_UPDATE, 1, feedsProcessorPath);
    // Processes feed update
    feedsQueue.process(FEED_UPDATE, 2, feedProcessorPath);
  }

  return feedsQueue;
}

module.exports = {
  FEEDS_UPDATE,
  FEED_UPDATE,
  create
};
