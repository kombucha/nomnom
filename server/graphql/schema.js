const { readFileSync } = require("fs");
const path = require("path");
const { makeExecutableSchema } = require("graphql-tools");

const schemaPath = path.join(__dirname, "schema.gql");
const schemaStr = readFileSync(schemaPath, { encoding: "utf-8" });

const executableSchema = makeExecutableSchema({
  typeDefs: schemaStr,
  resolvers: {
    Date: require("./types/date"),
    User: {
      entries: require("./relations/userEntries")
    },
    UserEntry: {
      entry: require("./relations/userEntryEntry"),
      user: require("./relations/userEntryUser")
    },
    Query: {
      me: require("./queries/me"),
      userEntry: require("./queries/userEntry")
    },
    Mutation: {
      addUserEntry: require("./mutations/addUserEntry")
    }
  }
});

module.exports = executableSchema;
