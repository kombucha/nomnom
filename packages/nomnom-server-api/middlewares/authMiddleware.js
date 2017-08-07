const user = require("nomnom-server-core/user");
const logger = require("nomnom-server-core/logger");

module.exports = () => async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const tokenPayload = await user.getTokenPayload(token);

    req.user = await user.getById(tokenPayload.userId);
    req.roles = tokenPayload.roles;
    req.roles = ["login"];

    next();
  } catch (err) {
    logger.error(err);
    res.sendStatus(403);
  }
};
