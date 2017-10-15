import React from "react";
import { storiesOf, action } from "@storybook/react";
import FlatButton from "./index.js";

// Flat Button
storiesOf("Flat Button", module)
  .addWithInfo("with text", () => (
    <div>
      <FlatButton onClick={action("clicked")}>Hello Button</FlatButton>
      <FlatButton primary onClick={action("clicked")}>
        Hello Button
      </FlatButton>
      <FlatButton secondary onClick={action("clicked")}>
        Hello Button
      </FlatButton>
    </div>
  ))
  .addWithInfo("with some emoji", () => (
    <FlatButton onClick={action("clicked")}>😀 😎 👍 💯</FlatButton>
  ));
