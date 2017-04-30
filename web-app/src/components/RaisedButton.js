import React from "react";
import styled from "styled-components";

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

const fadeColor = props =>
  (props.primary || props.secondary ? "rgba(255, 255, 255, 0.2)" : "rgba(153, 153, 153, 0.2)");

const asGradient = color => `linear-gradient(${color}, ${color})`;

const StyledButton = styled.button`
  min-width: 88px;
  height: ${height};
  padding: 0px 16px;
  margin: 0;

  outline: none;
  cursor: pointer;
  user-select: none;
  border: 10px;

  border-radius: 2px;
  box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px;

  color: ${textColor};
  background: ${props => asGradient(backgroundColor(props))};
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  line-height: ${height};
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0px;
  text-transform: uppercase;

  transition: background ${props => props.theme.transitionConfig};

  &:hover {
    background: ${props => `${asGradient(fadeColor(props))}, ${asGradient(backgroundColor(props))}`};
  }

  &[disabled] {
    color: ${props => props.theme.disabledColor};
    background: ${props => props.theme.disabledBackgroundColor};
    box-shadow: none;
    pointer-events: none;
  }
`;
const ChildrenWrapper = styled.div`display: flex; align-items: center; justify-content: center;`;

export const RaisedButton = ({ children, ...rest }) => (
  <StyledButton {...rest}>
    <ChildrenWrapper>{children}</ChildrenWrapper>
  </StyledButton>
);

export default RaisedButton;
