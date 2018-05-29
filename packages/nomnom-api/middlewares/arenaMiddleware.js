const Arena = require("bull-arena");
const { getQueuesNames } = require("../jobs");

const arenaMiddlewareFactory = basePath =>
  Arena(
    {
      queues: getQueuesNames().map(name => ({
        name,
        hostId: "nomnom",
        redis: {
          url: process.env.REDIS_URL
        }
      }))
    },
    {
      basePath,
      disableListen: true
    }
  );

module.exports = arenaMiddlewareFactory;
