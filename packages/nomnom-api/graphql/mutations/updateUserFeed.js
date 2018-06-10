const userFeedService = require("../../core/userFeed");

module.exports = async (_, { userFeedUpdateInput }, { loaders, user }) => {
  // TODO: Check authorization (ie only owner can update)
  // if (userFeedUpdateInput.id.indexOf(user.id) === -1) {
  //   throw new Error("Unauthorized");
  // }

  await userFeedService.update(userFeedUpdateInput.id, userFeedUpdateInput);
  return loaders.userFeed.load(userFeedUpdateInput.id);
};
