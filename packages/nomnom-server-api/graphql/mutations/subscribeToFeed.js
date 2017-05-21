const UserFeed = require("nomnom-server-core/userFeed");

module.exports = (_, { subscribeToFeedInput }, { user }) =>
  UserFeed.create(user.id, subscribeToFeedInput);
