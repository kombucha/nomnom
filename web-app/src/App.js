import React, { Component } from "react";
import { Route } from "react-router-dom";
import AppBar from "material-ui/AppBar";

import Entries from "./pages/Entries";
import Entry from "./pages/Entry";

class App extends Component {
  render() {
    return (
      <div className="App">
        <AppBar title="NomNom" />
        <Route exact path="/" component={Entries} />
        <Route path="/entries/:entryId" component={Entry} />
      </div>
    );
  }
}

export default App;
