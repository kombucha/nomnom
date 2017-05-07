const feedService = require("../../services/feed");

module.exports = (parentUser, _, { user }) => {
  if (parentUser.id !== user.id) {
    return [];
  }
  // TODO
  return [];
};
