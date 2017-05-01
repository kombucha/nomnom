import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const FieldContainer = styled.div`
  display: inline-block;
  position: relative;
  width: 100%;

  font-size: 16px;
  height: 48px;
  line-height: 24px;

  background-color: transparent;
  transition: height ${props => props.theme.transitionConfig};
  cursor: auto;
`;

const CustomInput = styled.input`
  height: 100%;
  width: 100%;
  border: none;
  outline: none;
  background-color: rgba(0, 0, 0, 0);
  color: rgba(0, 0, 0, 0.87);
  cursor: inherit;
  font-style: inherit;
  font-variant: inherit;
  font-weight: inherit;
  font-stretch: inherit;
  font-size: inherit;
  line-height: inherit;
  font-family: inherit;
`;

const HintText = styled.div`
  position: absolute;
  bottom: 12px;
  opacity: ${props => (props.show ? 1 : 0)};
  color: rgba(0, 0, 0, 0.298);
  transition: opacity ${props => props.theme.transitionConfig};
  user-select: none;
  pointer-events: none;
`;

const BottomBorder = styled.div`
  position: absolute;
  width: 100%;
  bottom: 8px;
  border: none;
  border-bottom: 1px solid rgb(224, 224, 224);
`;

const FocusBottomBorder = styled.div`
  position: absolute;
  width: 100%;
  bottom: 8px;

  border: none;
  border-bottom: 2px solid ${props => props.theme.primary1Color};

  transform: scaleX(${props => (props.show ? 1 : 0)});
  transition: transform ${props => props.theme.transitionConfig};
`;

export class TextField extends Component {
  constructor() {
    super();
    this.state = { focused: false };
  }

  render() {
    const { type, value, onChange, hintText, ...rest } = this.props;
    return (
      <FieldContainer>
        <HintText show={!value}>{hintText}</HintText>
        <CustomInput
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => this.setState({ focused: true })}
          onBlur={() => this.setState({ focused: false })}
          {...rest}
        />
        <BottomBorder />
        <FocusBottomBorder show={this.state.focused} />
      </FieldContainer>
    );
  }
}

TextField.propTypes = {
  type: PropTypes.string,
  onChange: PropTypes.func,
  hintText: PropTypes.string
};
TextField.defaultProps = {
  type: "text",
  onChange: () => {}
};

export default TextField;
