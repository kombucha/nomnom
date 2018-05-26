const UserEntry = require("../../core/userEntry");

module.exports = (_, { addUserEntryInput }, { user }) =>
  UserEntry.create(user.id, addUserEntryInput);
