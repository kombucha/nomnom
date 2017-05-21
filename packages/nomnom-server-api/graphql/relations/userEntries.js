const UserEntry = require("nomnom-server-core/userEntry");

module.exports = (parentUser, { status }, { user }) => {
  if (parentUser.id !== user.id) {
    return [];
  }

  return UserEntry.list(parentUser.id, { status });
};
