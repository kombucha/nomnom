const loaders = require("../graphql/loaders");

module.exports = () => (req, res, next) => {
  req.loaders = loaders();
  next();
};
