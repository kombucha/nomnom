import React from "react";
import { storiesOf } from "@storybook/react";
import AppBar from "../components/AppBar";

storiesOf("AppBar", module).addWithInfo("basic", () => <AppBar title="App bar title" />);
