const UserEntry = require("../../services/userEntry");

module.exports = (_, { addUserEntryInput }, { user }) =>
  UserEntry.createFromUrl(user.id, addUserEntryInput.url, addUserEntryInput.status);
