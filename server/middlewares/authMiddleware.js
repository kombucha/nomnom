const user = require("../services/user");
const logger = require("../services/logger");

module.exports = () =>
  async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const tokenPayload = await user.getTokenPayload(token);

      req.user = await user.getById(tokenPayload.userId);
      req.roles = tokenPayload.roles;

      next();
    } catch (err) {
      logger.error(err);
      next(err);
    }
  };
