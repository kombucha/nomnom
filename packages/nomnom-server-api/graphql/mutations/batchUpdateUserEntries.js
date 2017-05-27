const UserEntry = require("nomnom-server-core/userEntry");

module.exports = async (_, { batchUpdateUserEntriesInput }, { loaders, user }) => {
  // TODO: Check authorization (ie only owner can update)
  // if (entryUpdateInput.id.indexOf(user.id) === -1) {
  //   throw new Error("Unauthorized");
  // }

  await UserEntry.batchUpdate(batchUpdateUserEntriesInput.ids, {
    status: batchUpdateUserEntriesInput.status
  });

  return loaders.userEntry.loadMany(batchUpdateUserEntriesInput.ids);
};
