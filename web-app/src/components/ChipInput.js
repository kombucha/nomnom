import React, { Component } from "react";
import PropTypes from "prop-types";

import Chip from "./Chip";
import TextField from "./TextField";

const ENTER_KEY_CODE = 13;

export class ChipInput extends Component {
  constructor() {
    super();
    this.state = { textValue: "" };
    this._handleTextChange = this._handleTextChange.bind(this);
    this._handleAddValue = this._handleAddValue.bind(this);
    this._handleDeleteValue = this._handleDeleteValue.bind(this);
  }

  _handleTextChange(ev) {
    this.setState({ textValue: ev.target.value });
  }

  _handleDeleteValue(deletedValue) {
    const { value: values } = this.props;
    const newValues = values.filter(value => value !== deletedValue);
    this.props.onChange(newValues);
  }

  _handleAddValue(newValue) {
    const { value: values } = this.props;
    if (newValue && !values.includes(newValue)) {
      const newValues = [...values, newValue];
      this.props.onChange(newValues);
    }
    this.setState({ textValue: "" });
  }

  render() {
    const { value: values } = this.props;
    const { disabled, hintText } = this.props;
    const { textValue } = this.state;

    return (
      <div>
        {values.map(chipValue => (
          <Chip key={chipValue} onRequestDelete={() => this._handleDeleteValue(chipValue)}>
            {chipValue}
          </Chip>
        ))}

        <TextField
          hintText={hintText}
          disabled={disabled}
          value={textValue}
          onChange={this._handleTextChange}
          onKeyDown={ev => {
            if (ev.keyCode === ENTER_KEY_CODE) this._handleAddValue(this.state.textValue);
          }}
        />
      </div>
    );
  }
}

ChipInput.propTypes = {
  value: PropTypes.array
};
ChipInput.defaultProps = {
  value: []
};

export default ChipInput;
