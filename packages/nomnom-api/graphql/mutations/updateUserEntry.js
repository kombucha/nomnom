const UserEntry = require("../../core/userEntry");

module.exports = async (_, { entryUpdateInput }, { user }) => {
  // TODO: Check authorization (ie only owner can update)
  // if (entryUpdateInput.id.indexOf(user.id) === -1) {
  //   throw new Error("Unauthorized");
  // }

  return UserEntry.update(entryUpdateInput.id, entryUpdateInput);
};
