import { query } from "../graphql/queries/user";

export default (context, apolloClient) =>
  apolloClient
    .query({ query })
    .then(({ data }) => {
      return data.me;
    })
    .catch(() => {
      // Fail gracefully
      console.log("Youre not logged in");
      return null;
    });
