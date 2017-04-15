const user = require("../services/user");
const logger = require("../services/logger");

module.exports = () =>
  async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      req.user = await user.getFromToken(token);
      next();
    } catch (err) {
      logger.error(err);
      next(err);
    }
  };
