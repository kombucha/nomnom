const { graphqlExpress } = require("graphql-server-express");
const schema = require("../graphql/schema");

module.exports = () =>
  graphqlExpress(req => ({
    schema,
    context: {
      user: req.user,
      roles: req.roles,
      loaders: req.loaders
    }
  }));
