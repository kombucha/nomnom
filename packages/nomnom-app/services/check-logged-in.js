import gql from "graphql-tag";
import { query as userQuery } from "../graphql/queries/user";

export default (context, apolloClient) =>
  apolloClient
    .query({ query: userQuery })
    .then(({ data }) => {
      return { loggedInUser: data.me };
    })
    .catch(() => {
      // Fail gracefully
      console.log("Youre not logged in");
      return { loggedInUser: {} };
    });
