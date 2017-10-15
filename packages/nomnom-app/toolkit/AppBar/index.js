import React from "react";
import { pure } from "recompose";
import styled from "styled-components";

const AppBarContainer = styled.div`
  position: ${props => (props.fixed ? "fixed" : "static")};
  height: ${props => props.theme.appBarHeight};
  width: 100%;
  padding: 0px 24px;
  z-index: 1000;

  display: flex;
  align-items: center;

  box-shadow: ${props => props.theme.shadow};
  background-color: ${props => props.theme.primary1Color};
  color: white;
`;

const AppTitle = styled.span`
  flex: 1;
  font-size: 24px;
  font-weight: 400;
`;

export const AppBar = ({ title, rightElement, fixed }) => (
  <AppBarContainer fixed={fixed}>
    <AppTitle>{title}</AppTitle>
    {rightElement}
  </AppBarContainer>
);

export default pure(AppBar);
