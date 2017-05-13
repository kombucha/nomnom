const UserFeed = require("../../services/userFeed");

module.exports = (_, { subscribeToFeedInput }, { user }) =>
  UserFeed.create(user.id, subscribeToFeedInput);
