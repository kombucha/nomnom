const express = require("express");
const morgan = require("morgan");

const config = require("./config");
const authMiddleware = require("./middlewares/authMiddleware");
const loadersMiddleware = require("./middlewares/loadersMiddleware");
const graphqlMiddleware = require("./middlewares/graphlMiddleware");
const logger = require("./services/logger");

const app = express();

app.use(morgan("dev", { stream: logger.stream }));
app.use(authMiddleware());
app.use(loadersMiddleware());
app.use("/img", express.static(config.imagesPath));
app.use("/graphql", graphqlMiddleware());

app.listen(config.port);
logger.info(
  `Running a GraphQL API server at http://localhost:${config.port}/graphql`
);
