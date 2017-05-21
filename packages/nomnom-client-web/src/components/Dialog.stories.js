import React from "react";
import { storiesOf, action } from "@storybook/react";
import FlatButton from "../components/FlatButton";
import Dialog from "../components/Dialog";

storiesOf("Dialog", module)
  .addWithInfo("Basic Dialog", () => (
    <Dialog open title="Dialog title" onRequestClose={action("onRequestClose")}>
      Hello, this is a dialog !
    </Dialog>
  ))
  .addWithInfo("with some actions", () => (
    <Dialog
      open
      title="Dialog title"
      onRequestClose={action("onRequestClose")}
      actions={[
        <FlatButton secondary onClick={action("cancel")}>Cancel</FlatButton>,
        <FlatButton onClick={action("ok")}>Ok</FlatButton>
      ]}>
      Hello, this is a dialog with actions !
    </Dialog>
  ));
