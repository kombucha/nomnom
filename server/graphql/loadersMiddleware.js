const loaders = require("./loaders");

module.exports = () =>
  (req, res, next) => {
    req.loaders = loaders();
    next();
  };
