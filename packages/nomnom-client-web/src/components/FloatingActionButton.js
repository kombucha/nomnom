import styled from "styled-components";
import { lighten } from "polished";

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

const fixedStyles = `
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 100;
`;

const size = "56px";
export const FloatingActionButton = styled.button`
  ${props => (props.fixed ? fixedStyles : "")}
  width: ${size};
  height: ${size};

  outline: none;
  border: none;
  cursor: pointer;
  user-select: none;

  border-radius: 50%;
  box-shadow: ${props => props.theme.shadow};

  font-size: 24px;

  color: ${textColor};
  background: ${props => backgroundColor(props)};
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  transition: all ${props => props.theme.transitionConfig};

  &:hover {
    background: ${props => lighten(0.1, backgroundColor(props))};
  }

  &[disabled] {
    color: ${props => props.theme.disabledColor};
    background: ${props => props.theme.disabledBackgroundColor};
    box-shadow: none;
    pointer-events: none;
  }
`;
FloatingActionButton.displayName = "FloatingActionButton";

export default FloatingActionButton;
