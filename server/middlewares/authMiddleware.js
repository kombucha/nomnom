const user = require("../services/user");
const logger = require("../services/logger");

module.exports = () =>
  async (req, res, next) => {
    // Fake it til you make it !
    const id = "USER::first-user";
    try {
      req.user = await user.getById(id);
      next();
    } catch (err) {
      logger.error(err);
      next(err);
    }
  };
