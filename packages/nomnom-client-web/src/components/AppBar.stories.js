import React from "react";
import { storiesOf } from "@kadira/storybook";
import AppBar from "../components/AppBar";

storiesOf("AppBar", module).addWithInfo("basic", () => <AppBar title="App bar title" />);
