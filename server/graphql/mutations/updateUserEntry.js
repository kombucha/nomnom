const UserEntry = require("../../services/userEntry");

module.exports = (_, { entryUpdateInput }, { loaders, user }) => {
  if (entryUpdateInput.id.indexOf(user.id) === -1) {
    throw new Error("Unauthorized");
  }

  return UserEntry.updateUserEntry(
    entryUpdateInput.id,
    entryUpdateInput
  ).then(() => loaders.genericLoader.load(entryUpdateInput.id));
};
