const UserEntry = require("nomnom-server-core/userEntry");

module.exports = async (_, { entryUpdateInput }, { loaders, user }) => {
  // TODO: Check authorization (ie only owner can update)
  // if (entryUpdateInput.id.indexOf(user.id) === -1) {
  //   throw new Error("Unauthorized");
  // }

  await UserEntry.update(entryUpdateInput.id, entryUpdateInput);
  return loaders.userEntry.load(entryUpdateInput.id);
};