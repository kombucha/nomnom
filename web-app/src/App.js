import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import styled from "styled-components";

import PageTitle from "./components/PageTitle";
import AppBar from "./components/AppBar";
import PrivateRoute from "./components/PrivateRoute";
import UserMenu from "./components/UserMenu";
import Entries from "./pages/Entries";
import Entry from "./pages/Entry";
import Login from "./pages/Login";
import Settings from "./pages/Settings";

const PageContainer = styled.div`padding-top: 64px;`;
const UnstyledLink = styled(Link)`text-decoration: none; color: inherit;`;

class App extends Component {
  render() {
    return (
      <div className="App">
        <PageTitle value="NomNom" />
        <AppBar
          fixed
          title={<UnstyledLink to="/">NomNom</UnstyledLink>}
          rightElement={<UserMenu />}
        />
        <PageContainer>
          <Route path="/login" component={Login} />
          <PrivateRoute exact path="/" component={Entries} />
          <PrivateRoute path="/entries/:entryId" component={Entry} />
          <PrivateRoute path="/settings" component={Settings} />
        </PageContainer>
      </div>
    );
  }
}

export default App;
