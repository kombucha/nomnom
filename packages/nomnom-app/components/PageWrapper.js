import React from "react";
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

const PageWrapper = ({ user, children }) =>
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
        rightElement={user ? <UserMenu user={user} /> : null}
      />
      <PageContainer>
        {children}
      </PageContainer>
    </div>
  </ThemeProvider>;

export default PageWrapper;
