const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const logger = require("./core/logger");
const authMiddleware = require("./middlewares/authMiddleware");
const basicAuthMiddleware = require("./middlewares/basicAuthMiddleware");
const loadersMiddleware = require("./middlewares/loadersMiddleware");
const graphqlMiddleware = require("./middlewares/graphlMiddleware");
const arenaMiddleware = require("./middlewares/arenaMiddleware");
const loginRouter = require("./routes/login");

function launchServer() {
  return new Promise((resolve, reject) => {
    const port = parseInt(process.env.PORT, 10);
    const app = express();

    app.use(cors({ origin: true, credentials: true }));
    app.use(morgan("dev", { stream: logger.stream }));

    // Arena (their setup is a bit awkward :/ )
    app.use("/arena", basicAuthMiddleware(process.env.ARENA_USERNAME, process.env.ARENA_PASSWORD));
    app.use("/", arenaMiddleware("/arena"));

    // Login endpoints
    app.use("/login", loginRouter);

    // Graphql
    app.use(
      "/graphql",
      authMiddleware(),
      loadersMiddleware(),
      bodyParser.json({ limit: "2mb" }),
      graphqlMiddleware()
    );

    // Error handling
    app.use((err, req, res, next) => {
      logger.error(err.stack);
      res.status(500).send("Something broke!");
    });

    app.listen(port, err => {
      if (err) {
        logger.error("Failed to launch server");
        logger.error(err);
        return reject(err);
      }

      logger.info(`Running api server at http://localhost:${port}`);
      resolve();
    });
  });
}

module.exports = {
  launchServer
};
