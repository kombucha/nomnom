const express = require("express");
const config = require("./config");
const authMiddleware = require("./authMiddleware");
const loadersMiddleware = require("./graphql/loadersMiddleware");
const graphqlMiddleware = require("./graphql/middleware");

const app = express();

app.use(authMiddleware());
app.use(loadersMiddleware());
app.use("/img", express.static(config.imagesPath));
app.use("/graphql", graphqlMiddleware());

app.listen(config.port);
console.log(
  `Running a GraphQL API server at http://localhost:${config.port}/graphql`
);
