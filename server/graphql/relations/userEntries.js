const UserEntry = require("../../services/userEntry");

module.exports = (parentUser, { status }, { user }) => {
  if (parentUser.id !== user.id) {
    return [];
  }

  return UserEntry.getUserEntries(parentUser.id, { status });
};
