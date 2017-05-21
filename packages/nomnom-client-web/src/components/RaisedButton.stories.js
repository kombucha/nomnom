import React from "react";
import { storiesOf, action } from "@kadira/storybook";
import RaisedButton from "../components/RaisedButton";

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
