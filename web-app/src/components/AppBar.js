import React from "react";
import styled from "styled-components";

const height = "64px";
const AppBarContainer = styled.div`
  position: ${props => (props.fixed ? "fixed" : "static")};
  height: ${height};
  width: 100%;
  padding: 0px 24px;
  z-index: 1000;

  display: flex;
  align-items: center;

  box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px;
  background-color: ${props => props.theme.primary1Color};
  color: white;
`;

const AppTitle = styled.span`
  flex: 1;
  height: ${height};
  line-height: ${height};

  color: white;
  text-decoration: none;
  font-size: 24px;
  font-weight: 400;
`;

export const AppBar = ({ title, rightElement, fixed }) => (
  <AppBarContainer fixed={fixed}>
    <AppTitle>{title}</AppTitle>
    {rightElement}
  </AppBarContainer>
);

export default AppBar;
