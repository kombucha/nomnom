import React from "react";
import { storiesOf, action } from "@kadira/storybook";
import ChipInput from "../components/ChipInput";

storiesOf("Chip input", module).addWithInfo("Deletable Chip", () => (
  <ChipInput hintText="Type some more values" value={["hello", "world"]} onChange={action('onChange')} />
));
