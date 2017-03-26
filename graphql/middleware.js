const graphqlHTTP = require("express-graphql");
const schema = require("./schema");

module.exports = () =>
  graphqlHTTP(req => ({
    schema,
    context: {
      user: req.user,
      loaders: req.loaders
    },
    graphiql: true
  }));
