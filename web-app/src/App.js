import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import AppBar from "material-ui/AppBar";

import PrivateRoute from "./components/PrivateRoute";
import Entries from "./pages/Entries";
import Entry from "./pages/Entry";
import Login from "./pages/Login";

const STYLES = {
  appBar: {
    position: "fixed"
  },
  pageContent: {
    paddingTop: 64
  },
  title: {
    textDecoration: "none",
    color: "inherit"
  }
};
class App extends Component {
  render() {
    const title = <Link style={STYLES.title} to="/">NomNom</Link>;

    return (
      <div className="App">
        <AppBar title={title} style={STYLES.appBar} />
        <div style={STYLES.pageContent}>
          <Route path="/login" component={Login} />
          <PrivateRoute exact path="/" component={Entries} />
          <PrivateRoute path="/entries/:entryId" component={Entry} />
        </div>
      </div>
    );
  }
}

export default App;
