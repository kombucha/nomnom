const UserEntry = require("../../services/userEntry");
const logger = require("../../services/logger");

module.exports = async (_, { url }, { user }) => {
  try {
    await UserEntry.deleteAll(user.id);
    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
};
