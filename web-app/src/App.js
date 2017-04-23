import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import AppBar from "material-ui/AppBar";

import PrivateRoute from "./components/PrivateRoute";
import UserMenu from "./components/UserMenu";
import Entries from "./pages/Entries";
import Entry from "./pages/Entry";
import Login from "./pages/Login";
import Settings from "./pages/Settings";

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
  },
  menuContainer: {
    // Alignment hacks...
    height: "64px",
    display: "flex",
    alignItems: "center",
    marginTop: "-8px"
  }
};
class App extends Component {
  render() {
    const title = <Link style={STYLES.title} to="/">NomNom</Link>;
    const userMenu = <div style={STYLES.menuContainer}><UserMenu /></div>;

    return (
      <div className="App">
        <AppBar
          title={title}
          style={STYLES.appBar}
          showMenuIconButton={false}
          iconElementRight={userMenu}
        />
        <div style={STYLES.pageContent}>
          <Route path="/login" component={Login} />
          <PrivateRoute exact path="/" component={Entries} />
          <PrivateRoute path="/entries/:entryId" component={Entry} />
          <PrivateRoute path="/settings" component={Settings} />
        </div>
      </div>
    );
  }
}

export default App;
