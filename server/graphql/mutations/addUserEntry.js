const UserEntry = require("../../services/userEntry");

module.exports = (_, { url }, { user }) => {
  return UserEntry.createFromUrl(user.id, url);
};
