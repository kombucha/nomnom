const UserEntry = require("../../services/userEntry");

module.exports = async (_, { entryUpdateInput }, { loaders, user }) => {
  if (entryUpdateInput.id.indexOf(user.id) === -1) {
    throw new Error("Unauthorized");
  }

  await UserEntry.updateUserEntry(entryUpdateInput.id, entryUpdateInput);
  return loaders.genericLoader.load(entryUpdateInput.id);
};
