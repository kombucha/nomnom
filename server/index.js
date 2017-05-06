const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const config = require("./config");
const authMiddleware = require("./middlewares/authMiddleware");
const loadersMiddleware = require("./middlewares/loadersMiddleware");
const graphqlMiddleware = require("./middlewares/graphlMiddleware");
const loginRouter = require("./routes/login");
const logger = require("./services/logger");

const app = express();

app.use(morgan("dev", { stream: logger.stream }));

app.use("/img", express.static(config.imagesPath));
app.use("/login", loginRouter);
app.use("/graphql", authMiddleware(), loadersMiddleware(), bodyParser.json(), graphqlMiddleware());

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(config.port);
logger.info(`Running a GraphQL API server at http://localhost:${config.port}/graphql`);
