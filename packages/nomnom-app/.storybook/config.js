import React from "react";
import { configure, setAddon, addDecorator } from "@storybook/react";
import infoAddon from "@storybook/addon-info";
import { ThemeProvider } from "styled-components";

import theme from "../toolkit/theme";
import "../toolkit/styles.js";

const req = require.context("../toolkit", true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(story => <ThemeProvider theme={theme}>{story()}</ThemeProvider>);

setAddon(infoAddon);

configure(loadStories, module);
