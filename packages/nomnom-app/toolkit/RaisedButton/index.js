import React from "react";
import styled from "@emotion/styled";
import { lighten } from "polished";

const height = "36px";
const textColor = props => {
  if (props.primary || props.secondary) {
    return props.theme.alternateTextColor;
  } else {
    return props.theme.textColor;
  }
};

const backgroundColor = props => {
  if (props.primary) {
    return props.theme.primary1Color;
  } else if (props.secondary) {
    return props.theme.accent1Color;
  } else {
    return "rgba(0,0,0,0)";
  }
};

const StyledButton = styled.button`
  min-width: 88px;
  height: ${height};
  padding: 0px 16px;
  margin: 0;

  outline: none;
  border: none;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  border-radius: 2px;
  box-shadow: ${props => props.theme.shadow};

  color: ${textColor};
  background: ${props => backgroundColor(props)};

  line-height: ${height};
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0px;
  text-transform: uppercase;

  transition: background ${props => props.theme.transitionConfig};

  &:hover,
  &:focus {
    background: ${props => lighten(0.1, backgroundColor(props))};
  }

  &[disabled] {
    color: ${props => props.theme.disabledColor};
    background: ${props => props.theme.disabledBackgroundColor};
    box-shadow: none;
    pointer-events: none;
  }
`;
const ChildrenWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RaisedButton = ({ children, ...rest }) => (
  <StyledButton {...rest}>
    <ChildrenWrapper>{children}</ChildrenWrapper>
  </StyledButton>
);

export default RaisedButton;
