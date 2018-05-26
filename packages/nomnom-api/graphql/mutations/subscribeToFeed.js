const UserFeed = require("../../core/userFeed");

module.exports = (_, { subscribeToFeedInput }, { user }) =>
  UserFeed.create(user.id, subscribeToFeedInput);
