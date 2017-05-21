import React from "react";
import { storiesOf, action } from "@kadira/storybook";
import Chip from "../components/Chip";

storiesOf("Chip", module)
  .addWithInfo("Simple chip", () => <Chip onClick={action("clicked")}>Hello</Chip>)
  .addWithInfo("Deletable Chip", () => (
    <Chip onClick={action("clicked")} onRequestDelete={action("delete me")}>
      Hello
    </Chip>
  ));
