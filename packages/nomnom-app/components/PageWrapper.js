import React from "react";
import { pure } from "recompose";
import Link from "next/link";
import styled, { ThemeProvider } from "styled-components";

import "../toolkit/styles.js";
import { AppBar } from "../toolkit/AppBar";
import theme from "../toolkit/theme";
import PageTitle from "./PageTitle";
import UserMenu from "./UserMenu";

const PageContainer = styled.div`padding-top: ${props => props.theme.appBarHeight};`;
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

export default pure(PageWrapper);
