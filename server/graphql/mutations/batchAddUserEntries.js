const Promise = require("bluebird");
const UserEntry = require("../../services/userEntry");
const logger = require("../../services/logger");

module.exports = (_, { batchAddUserEntriesInput }, { user }) =>
  Promise.map(
    batchAddUserEntriesInput,
    async addUserEntryInput => {
      try {
        const userEntry = await UserEntry.create(user.id, addUserEntryInput);
        return userEntry;
      } catch (error) {
        logger.error(`Failed to add user entry for url ${addUserEntryInput.url}`, error);
        return null;
      }
    },
    { concurrency: 4 }
  );
