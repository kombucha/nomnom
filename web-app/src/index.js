import React from "react";
import ReactDOM from "react-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface
} from "react-apollo";

import getTheme from "./myTheme";
import App from "./App";
import "./index.css";

const networkInterface = createNetworkInterface({
  uri: "http://localhost:3000/graphql"
});
const client = new ApolloClient({ networkInterface });

injectTapEventPlugin();
ReactDOM.render(
  <ApolloProvider client={client}>
    <MuiThemeProvider muiTheme={getTheme()}>
      <App />
    </MuiThemeProvider>
  </ApolloProvider>,
  document.getElementById("root")
);
