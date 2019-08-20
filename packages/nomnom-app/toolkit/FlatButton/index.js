import React from "react";
import styled from "@emotion/styled";
import { ellipsis } from "polished";

const height = "36px";
const textColor = props => {
  if (props.primary) {
    return props.theme.primary1Color;
  } else if (props.secondary) {
    return props.theme.accent1Color;
  } else {
    return props.theme.textColor;
  }
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 88px;
  height: ${height};
  padding: 0px 16px;
  margin: 0;

  outline: none;
  border: none;
  cursor: pointer;
  user-select: none;

  color: ${textColor};
  background-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  line-height: ${height};
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0px;
  text-transform: uppercase;
  ${ellipsis()};

  transition: background-color ${props => props.theme.transitionConfig};

  &:hover,
  &:focus {
    background-color: rgba(153, 153, 153, 0.2);
  }

  &[disabled] {
    color: ${props => props.theme.disabledColor};
    pointer-events: none;
  }
`;

export const FlatButton = ({ children, ...rest }) => (
  <StyledButton {...rest}>{children}</StyledButton>
);

export default FlatButton;
