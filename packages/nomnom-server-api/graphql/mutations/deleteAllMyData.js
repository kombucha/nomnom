const UserEntry = require("nomnom-server-core/userEntry");
const logger = require("nomnom-server-core/logger");

module.exports = async (_, { url }, { user }) => {
  try {
    // TODO: delete subscriptions also
    await UserEntry.deleteAll(user.id);
    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
};
