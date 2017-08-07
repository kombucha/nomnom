import { ApolloClient, createBatchingNetworkInterface } from "react-apollo";
import fetch from "isomorphic-fetch";
import logout from "./logout";

let apolloClient = null;

if (!process.browser) {
  global.fetch = fetch;
}

function create(initialState, { getToken }) {
  let client;
  const networkInterface = createBatchingNetworkInterface({
    uri: "http://localhost:4001/graphql",
    batchInterval: 10,
    opts: { credentials: "include" }
  });
  const authMiddleware = {
    applyBatchMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};
      }

      const token = getToken();
      req.options.headers.authorization = token ? `Bearer ${token}` : null;
      next();
    }
  };
  const logoutAfterware = {
    applyBatchAfterware({ responses }, next) {
      const shouldLogout = responses.some(res => res.status === 401 || res.status === 403);
      if (shouldLogout) {
        logout(client);
      }
      next();
    }
  };

  networkInterface.use([authMiddleware]);
  networkInterface.useAfter([logoutAfterware]);

  client = new ApolloClient({
    initialState,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    queryDeduplication: true,
    networkInterface
  });

  return client;
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
