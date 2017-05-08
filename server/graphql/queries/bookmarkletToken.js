const { createToken } = require("../../services/user");

module.exports = (_, { userEntryId }, { user }) => createToken(user, ["bookmarklet"]);
