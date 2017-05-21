const Promise = require("bluebird");
const logger = require("nomnom-server-core/logger");
const UserFeed = require("nomnom-server-core/UserFeed");

module.exports = (_, { batchSubscribeToFeedsInput }, { user }) =>
  Promise.map(
    batchSubscribeToFeedsInput,
    async subscribeToFeedInput => {
      try {
        const userFeed = await UserFeed.create(user.id, subscribeToFeedInput);
        return userFeed;
      } catch (error) {
        logger.error(
          `Failed to add user entry for url ${subscribeToFeedInput.uri}`,
          error
        );
        return null;
      }
    },
    { concurrency: 4 }
  );
