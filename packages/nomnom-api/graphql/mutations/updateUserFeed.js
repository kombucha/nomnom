const UserFeed = require("../../core/userFeed");

module.exports = async (_, { entryUpdateInput }, { loaders, user }) => {
  // TODO: Check authorization (ie only owner can update)
  // if (entryUpdateInput.id.indexOf(user.id) === -1) {
  //   throw new Error("Unauthorized");
  // }

  await UserFeed.update(entryUpdateInput.id, entryUpdateInput);
  return loaders.userEntry.load(entryUpdateInput.id);
};
