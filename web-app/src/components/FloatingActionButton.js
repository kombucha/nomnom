import styled from "styled-components";

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

  color: ${textColor};
  background: ${props => asGradient(backgroundColor(props))};
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  transition: all ${props => props.theme.transitionConfig};

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

export default FloatingActionButton;
