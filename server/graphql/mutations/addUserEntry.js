const UserEntry = require("../../services/userEntry");

module.exports = (_, { url }, { user }) =>
  UserEntry.createFromUrl(user.id, url);
