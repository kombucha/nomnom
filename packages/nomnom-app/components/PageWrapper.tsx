import React from "react";
import Link from "next/link";
import styled from "@emotion/styled";

import { AppBar } from "../toolkit/AppBar";
import { ThemeType } from "../toolkit/theme";
import StylesWrapper from "../toolkit/StylesWrapper";
import PageTitle from "./PageTitle";
import UserMenu from "./UserMenu";

type Props = { user?: any };

const PageContainer = styled.div<{}, ThemeType>`
  padding-top: ${props => props.theme.appBarHeight};
`;

const UnstyledLink = styled.a`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
`;

const PageWrapper: React.FC<Props> = ({ user, children }) => (
  <StylesWrapper>
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
      <PageContainer>{children}</PageContainer>
    </div>
  </StylesWrapper>
);

export default PageWrapper;
