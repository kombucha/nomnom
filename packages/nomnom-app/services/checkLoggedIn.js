import { query } from "../graphql/queries/user";

export default context =>
  context.apolloClient
    .query({ query })
    .then(({ data }) => {
      return data.me;
    })
    .catch(() => {
      // Fail gracefully
      return null;
    });
