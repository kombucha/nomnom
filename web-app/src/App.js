import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import AppBar from "material-ui/AppBar";

import Entries from "./pages/Entries";
import Entry from "./pages/Entry";

const STYLES = {
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
        <AppBar title={title} />
        <Route exact path="/" component={Entries} />
        <Route path="/entries/:entryId" component={Entry} />
      </div>
    );
  }
}

export default App;
