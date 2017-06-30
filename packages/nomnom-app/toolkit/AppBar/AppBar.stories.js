import React from "react";
import { storiesOf } from "@storybook/react";
import AppBar from "./index";

storiesOf("AppBar", module).addWithInfo("basic", () => <AppBar title="App bar title" />);
