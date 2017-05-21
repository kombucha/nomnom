const UserEntry = require("nomnom-server-core/userEntry");

module.exports = (_, { addUserEntryInput }, { user }) =>
  UserEntry.create(user.id, addUserEntryInput);
