const { DB_TYPE } = require("../../services/userEntry");

module.exports = (_, { userEntryId }, { loaders }) => {
  // TODO: check that entry.user === currentUser.id
  if (!userEntryId.startsWith(DB_TYPE)) {
    return null;
  }

  return loaders.genericLoader.load(userEntryId);
};
