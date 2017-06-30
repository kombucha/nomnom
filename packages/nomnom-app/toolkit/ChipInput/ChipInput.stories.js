import React, { Component } from "react";
import { storiesOf, action } from "@storybook/react";
import ChipInput from "./index.js";

class ChipInputWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value || ["hello", "world"] };
  }

  render() {
    const { onChange: originalOnChange, value: __, ...rest } = this.props;
    const { value } = this.state;
    const onChange = value => {
      this.setState({ value });
      originalOnChange(value);
    };

    return <ChipInput value={value} onChange={onChange} {...rest} />;
  }
}
ChipInputWrapper.displayName = "ChipInput";
ChipInputWrapper.propTypes = ChipInput.propTypes;
ChipInputWrapper.defaultProps = ChipInput.defaultProps;

storiesOf("Chip input", module).addWithInfo("Deletable Chip", () =>
  <ChipInputWrapper
    hintText="Type some more values"
    value={["hello", "world"]}
    onChange={action("onChange")}
  />
);
