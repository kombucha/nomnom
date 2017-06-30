import React, { Component } from "react";
import Link from "next/link";
import styled, { ThemeProvider } from "styled-components";

import "../toolkit/styles.js";
import { AppBar, APP_BAR_HEIGHT } from "../toolkit/AppBar";
import theme from "../toolkit/theme";
import PageTitle from "./PageTitle";
import UserMenu from "./UserMenu";

const PageContainer = styled.div`padding-top: ${APP_BAR_HEIGHT};`;
const UnstyledLink = styled.a`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
`;

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div id="app">
          <PageTitle value="NomNom" />
          <AppBar
            fixed
            title={
              <Link href="/">
                <UnstyledLink>NomNom</UnstyledLink>
              </Link>
            }
            rightElement={<UserMenu />}
          />
          <PageContainer>
            {this.props.children}
          </PageContainer>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
