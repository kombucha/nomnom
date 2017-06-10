import { ApolloClient, createBatchingNetworkInterface } from "react-apollo";
import authService from "./services/authentication";

export function createNetworkInterface() {
  const networkInterface = createBatchingNetworkInterface({
    uri: "http://localhost:3000/graphql",
    batchInterval: 10
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

export function createApolloClient() {
  const networkInterface = createNetworkInterface();
  return new ApolloClient({ networkInterface, queryDeduplication: true });
}

export default createApolloClient;
