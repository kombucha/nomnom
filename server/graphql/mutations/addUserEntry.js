const UserEntry = require("../../services/userEntry");

module.exports = (_, { addUserEntryInput }, { user }) =>
  UserEntry.create(user.id, addUserEntryInput);
