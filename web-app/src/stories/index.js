import React from "react";
import { storiesOf, action } from "@kadira/storybook";
import FlatButton from "../components/FlatButton";
import Chip from "../components/Chip";

import "../index.css";

storiesOf("Button", module)
  .addWithInfo("with text", () => (
    <div>
      <FlatButton onClick={action("clicked")}>Hello Button</FlatButton>
      <FlatButton primary onClick={action("clicked")}>Hello Button</FlatButton>
      <FlatButton secondary onClick={action("clicked")}>Hello Button</FlatButton>
    </div>
  ))
  .addWithInfo("with some emoji", () => (
    <FlatButton onClick={action("clicked")}>😀 😎 👍 💯</FlatButton>
  ));

storiesOf("Chip", module)
  .addWithInfo("Simple chip", () => <Chip onClick={action("clicked")}>Hello</Chip>)
  .addWithInfo("Deletable Chip", () => (
    <Chip onClick={action("clicked")} onRequestDelete={action("delete me")}>Hello</Chip>
  ));
