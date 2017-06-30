import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { lighten } from "polished";

const HANDLE_SIZE = "20px";
const handleColor = ({ checked, disabled, theme }) =>
  disabled ? "rgb(224, 224, 224)" : checked ? theme.primary1Color : "rgb(245, 245, 245)";
const barColor = ({ checked, theme }) =>
  checked ? lighten(0.2, theme.primary1Color) : "rgb(189, 189, 189)";

const Container = styled.div`
  display: inline-block;
  position: relative;
  width: 36px;
  padding: 3px 0px 3px 2px;
  margin-left: 8px;
`;

const InvisibleCheckbox = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;

  opacity: 0;
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
`;

const BackgroundBar = styled.div`
  width: 100%;
  height: 14px;
  border-radius: 30px;
  background-color: ${barColor};
  transition: background-color ${props => props.theme.transitionConfig};
`;

const Handle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${HANDLE_SIZE};
  height: ${HANDLE_SIZE};

  background-color: ${handleColor};
  transform: translateX(${props => (props.checked ? HANDLE_SIZE : "0px")});
  transition: all ${props => props.theme.transitionConfig};
  box-shadow: ${props => props.theme.shadow};

  border-radius: 50%;
`;

export class Toggle extends Component {
  _handleChange(checked) {
    this.props.onChange(checked);
  }

  render() {
    const { value, disabled } = this.props;
    return (
      <Container>
        <Handle checked={value} disabled={disabled} />
        <BackgroundBar checked={value} disabled={disabled} />
        <InvisibleCheckbox
          type="checkbox"
          checked={value}
          disabled={disabled}
          onChange={ev => this._handleChange(ev.target.checked)}
        />
      </Container>
    );
  }
}

Toggle.propTypes = {
  value: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func
};

Toggle.defaultProps = {
  value: false,
  disabled: false,
  onChange: checked => {}
};

export default Toggle;
