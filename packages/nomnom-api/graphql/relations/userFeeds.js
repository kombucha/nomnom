const UserFeed = require("../../core/userFeed");

module.exports = (parentUser, _, { user }) => {
  if (parentUser.id !== user.id) {
    return [];
  }

  return UserFeed.list(parentUser.id);
};
