const user = require("../core/user");
const logger = require("../core/logger");

module.exports = () => async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.sendStatus(403);
  }

  try {
    const token = authorization.split(" ")[1];
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
