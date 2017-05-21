import React, { Component } from "react";
import { storiesOf, action } from "@storybook/react";
import TextField from "../components/TextField";

const storyBookStyle = {
  maxWidth: 200,
  margin: 32
};

class TextFieldWrapper extends Component {
  constructor() {
    super();
    this.state = { value: "" };
  }
  render() {
    const { onChange: _, value: __, ...rest } = this.props;
    const { value } = this.state;

    const onChange = ev => {
      this.setState({ value: ev.target.value });
      action("onChange")(ev);
    };
    return <TextField onChange={onChange} value={value} {...rest} />;
  }
}
TextFieldWrapper.displayName = "TextField";
TextFieldWrapper.propTypes = TextField.propTypes;
TextFieldWrapper.defaultProps = TextField.defaultProps;

storiesOf("Text field", module)
  .addWithInfo("Basic usage", () => (
    <div style={storyBookStyle}>
      <TextFieldWrapper hintText="hint text" />
    </div>
  ))
  .addWithInfo("When disabled", () => (
    <div style={storyBookStyle}>
      <TextField hintText="Im disabled! #theITCrowd" disabled />
    </div>
  ));
