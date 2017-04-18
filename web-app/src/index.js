import React from "react";
import ReactDOM from "react-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface
} from "react-apollo";
import { BrowserRouter as Router } from "react-router-dom";

import getTheme from "./myTheme";
import App from "./App";
import authService from "./services/authentication";
import "./index.css";

const networkInterface = createNetworkInterface({
  uri: "http://localhost:3000/graphql"
});
const authMiddleware = {
  applyMiddleware(req, next) {
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

injectTapEventPlugin();
ReactDOM.render(
  <ApolloProvider client={client}>
    <MuiThemeProvider muiTheme={getTheme()}>
      <Router>
        <App />
      </Router>
    </MuiThemeProvider>
  </ApolloProvider>,
  document.getElementById("root")
);
