import React, { Component } from "react";
import { storiesOf, action } from "@storybook/react";
import Toggle from "../components/Toggle";

class ToggleWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value || false };
  }

  render() {
    const { onChange: originalOnChange, value: __, ...rest } = this.props;
    const { value } = this.state;
    const onChange = value => {
      this.setState({ value });
      originalOnChange(value);
    };

    return <Toggle value={value} onChange={onChange} {...rest} />;
  }
}
ToggleWrapper.displayName = "Toggle";
ToggleWrapper.propTypes = Toggle.propTypes;
ToggleWrapper.defaultProps = Toggle.defaultProps;

storiesOf("Toggle", module).addWithInfo("basic toggle", () => (
  <div>
    <ToggleWrapper onChange={action("onChange")} />
    <ToggleWrapper onChange={action("onChange")} value={true} />
    <ToggleWrapper onChange={action("onChange")} disabled />
  </div>
));
