import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter as Router } from "react-router-dom";

import registerServiceWorker from "./registerServiceWorker";
import theme from "./theme";
import createApolloClient from "./createApolloClient";
import App from "./App";
import "./index.css";

const apolloClient = createApolloClient();

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <ThemeProvider theme={theme}>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

registerServiceWorker();
