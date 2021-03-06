const Promise = require("bluebird");

const logger = require("../../core/logger");
const UserFeed = require("../../core/userFeed");

module.exports = (_, { batchSubscribeToFeedsInput }, { user }) =>
  Promise.map(
    batchSubscribeToFeedsInput,
    async subscribeToFeedInput => {
      try {
        const userFeed = await UserFeed.create(user.id, subscribeToFeedInput);
        return userFeed;
      } catch (error) {
        logger.error(`Failed to add user entry for url ${subscribeToFeedInput.uri}`);
        logger.error(error);
        return null;
      }
    },
    { concurrency: 4 }
  );
