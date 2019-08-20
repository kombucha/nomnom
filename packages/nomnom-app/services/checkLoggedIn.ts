import { USER_QUERY } from "../graphql/queries/user";
import ApolloClient from "apollo-client";

import { User } from "../apollo-types";

const checkLoggedIn = async (apolloClient: ApolloClient<any>) => {
  try {
    const result = await apolloClient.query<User>({ query: USER_QUERY });
    return result.data.me;
  } catch (err) {
    return null;
  }
};

export default checkLoggedIn;
