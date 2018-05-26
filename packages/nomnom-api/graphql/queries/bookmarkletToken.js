const { createToken } = require("../../core/user");

module.exports = (_, { userEntryId }, { user }) => createToken(user, ["bookmarklet"]);
