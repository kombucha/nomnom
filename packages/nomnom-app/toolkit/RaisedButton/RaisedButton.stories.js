import React from "react";
import { storiesOf, action } from "@storybook/react";
import RaisedButton from "./index.js";

storiesOf("Raised Button", module)
  .addWithInfo("with text", () => (
    <div>
      <RaisedButton onClick={action("clicked")}>Hello Button</RaisedButton>
      <RaisedButton primary onClick={action("clicked")}>
        Hello Button
      </RaisedButton>
      <RaisedButton secondary onClick={action("clicked")}>
        Hello Button
      </RaisedButton>
    </div>
  ))
  .addWithInfo("with some emoji", () => (
    <RaisedButton onClick={action("clicked")}>😀 😎 👍 💯</RaisedButton>
  ));
