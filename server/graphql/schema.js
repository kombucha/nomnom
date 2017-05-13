const { readFileSync } = require("fs");
const path = require("path");
const { makeExecutableSchema } = require("graphql-tools");

const schemaPath = path.join(__dirname, "schema.gql");
const schemaStr = readFileSync(schemaPath, { encoding: "utf-8" });

const checkRolesAny = (roles, resolver) =>
  (obj, args, context, info) => {
    const userRoles = context.roles || [];
    const isAuthorized = userRoles.some(role => roles.includes(role));

    if (isAuthorized) {
      return resolver(obj, args, context, info);
    } else {
      throw new Error("Unauthorized");
    }
  };

const executableSchema = makeExecutableSchema({
  typeDefs: schemaStr,
  resolvers: {
    Date: require("./types/date"),
    User: {
      entries: require("./relations/userEntries"),
      feeds: require("./relations/userFeeds")
    },
    UserEntry: {
      entry: require("./relations/userEntryEntry"),
      user: require("./relations/userEntryUser")
    },
    UserFeed: {
      feed: require("./relations/userFeedFeed"),
      user: require("./relations/userFeedUser")
    },
    Query: {
      me: checkRolesAny(["login"], require("./queries/me")),
      userEntry: checkRolesAny(["login"], require("./queries/userEntry")),
      bookmarkletToken: checkRolesAny(["login"], require("./queries/bookmarkletToken"))
    },
    Mutation: {
      addUserEntry: checkRolesAny(["login", "bookmarklet"], require("./mutations/addUserEntry")),
      batchAddUserEntries: checkRolesAny(["login"], require("./mutations/batchAddUserEntries")),
      updateUserEntry: checkRolesAny(["login"], require("./mutations/updateUserEntry")),

      updateUserFeed: checkRolesAny(["login"], require("./mutations/updateUserFeed")),
      subscribeToFeed: checkRolesAny(["login"], require("./mutations/subscribeToFeed")),
      unsubscribeFromFeed: checkRolesAny(["login"], require("./mutations/unsubscribeFromFeed")),
      batchSubscribeToFeeds: checkRolesAny(["login"], require("./mutations/batchSubscribeToFeeds")),

      deleteAllMyData: checkRolesAny(["login"], require("./mutations/deleteAllMyData"))
    }
  }
});

module.exports = executableSchema;
