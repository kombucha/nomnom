const basicAuth = require("basic-auth");

const basicAuthMiddlewareFactory = (username, password) => (req, res, next) => {
  const credentials = basicAuth(req);

  if (credentials && credentials.name === username && credentials.pass === password) {
    return next();
  }

  res.statusCode = 401;
  res.setHeader("WWW-Authenticate", 'Basic realm="nomnom"');
  res.end("Access denied");
};

module.exports = basicAuthMiddlewareFactory;
