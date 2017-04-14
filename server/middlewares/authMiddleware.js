const user = require("../services/user");

module.exports = () =>
  async (req, res, next) => {
    // Fake it til you make it !
    const id = "USER::first-user";
    try {
      req.user = await user.getById(id);
      next();
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
