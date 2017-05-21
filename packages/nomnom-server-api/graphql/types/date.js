// See http://dev.apollodata.com/tools/graphql-tools/scalars.html#Date-as-a-scalar
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

module.exports = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  parseValue(value) {
    return new Date(value); // value from the client
  },
  serialize(value) {
    return value; // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10); // ast value is always in string format
    }
    return null;
  }
});
