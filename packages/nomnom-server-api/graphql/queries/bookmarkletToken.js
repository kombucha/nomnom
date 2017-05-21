const { createToken } = require("nomnom-server-core/user");

module.exports = (_, { userEntryId }, { user }) => createToken(user, ["bookmarklet"]);
