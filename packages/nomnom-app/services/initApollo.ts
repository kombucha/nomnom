// Lifted from https://github.com/zeit/next.js/blob/master/examples/with-apollo-auth/lib/initApollo.js
import getConfig from "next/config";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import fetch from "isomorphic-unfetch";

const {
  publicRuntimeConfig: { apiUrl }
} = getConfig();

let apolloClient = null;

if (!process.browser) {
  (global as any).fetch = fetch;
}

function create(initialState, { getToken }) {
  const httpLink = createHttpLink({
    uri: `${apiUrl}/graphql`,
    credentials: "include"
  });

  const authLink = setContext((_, { headers }) => {
    const token = getToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ""
      }
    };
  });

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser,
    link: authLink.concat(httpLink),
    cache: new InMemoryCache().restore(initialState || {})
  });
}

export default function initApollo(initialState, options) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, options);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, options);
  }

  return apolloClient;
}
