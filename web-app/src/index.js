import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { ApolloClient, ApolloProvider } from "react-apollo";
import { createBatchingNetworkInterface } from "apollo-client"; // Transitive dep, so I dunno...
import { BrowserRouter as Router } from "react-router-dom";

import theme from "./theme";
import App from "./App";
import authService from "./services/authentication";
import "./index.css";

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
networkInterface.use([authMiddleware]);
const client = new ApolloClient({ networkInterface, queryDeduplication: true });

ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </ApolloProvider>,
  document.getElementById("root")
);
