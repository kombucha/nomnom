import { ApolloClient, createBatchingNetworkInterface } from "react-apollo";
import fetch from "isomorphic-fetch";
import authService from "./authentication";

const isInBrowser = process.browser;
let cachedApolloClient = null;

if (!isInBrowser) {
  global.fetch = fetch;
}

export function createNetworkInterface() {
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

      req.options.headers.authorization = authService.isAuthenticated()
        ? `Bearer ${authService.getToken()}`
        : null;
      next();
    }
  };
  const logoutAfterware = {
    applyBatchAfterware({ responses }, next) {
      const shouldLogout = responses.some(res => res.status === 401 || res.status === 403);
      if (shouldLogout) {
        authService.logout();
      }
      next();
    }
  };

  networkInterface.use([authMiddleware]);
  networkInterface.useAfter([logoutAfterware]);

  return networkInterface;
}

export function createApolloClient(initialState) {
  const networkInterface = createNetworkInterface();
  const apolloClient =
    cachedApolloClient ||
    new ApolloClient({
      initialState,
      ssrMode: !isInBrowser,
      queryDeduplication: true,
      networkInterface
    });

  if (isInBrowser) {
    cachedApolloClient = apolloClient;
  }

  return apolloClient;
}

export default createApolloClient;
