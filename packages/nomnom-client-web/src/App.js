import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import styled from "styled-components";

import asyncComponent from "./components/asyncComponent";
import PageTitle from "./components/PageTitle";
import { AppBar, APP_BAR_HEIGHT } from "./components/AppBar";
import PrivateRoute from "./components/PrivateRoute";
import UserMenu from "./components/UserMenu";
import Entries from "./pages/Entries";
import Entry from "./pages/Entry";
import Login from "./pages/Login";

const PageContainer = styled.div`padding-top: ${APP_BAR_HEIGHT}`;
const UnstyledLink = styled(Link)`text-decoration: none; color: inherit;`;

class App extends Component {
  render() {
    return (
      <div id="app">
        <PageTitle value="NomNom" />
        <AppBar
          fixed
          title={<UnstyledLink to="/">NomNom</UnstyledLink>}
          rightElement={<UserMenu />}
        />
        <PageContainer>
          <Switch>
            <Route path="/login" component={Login} />
            <PrivateRoute exact path="/" component={Entries} />
            <PrivateRoute path="/entries/:entryId" component={Entry} />
            <PrivateRoute
              path="/feeds"
              component={asyncComponent(() => import("./pages/Feeds"))}
            />
            <PrivateRoute
              path="/settings"
              component={asyncComponent(() => import("./pages/Settings"))}
            />
          </Switch>
        </PageContainer>
      </div>
    );
  }
}

export default App;
