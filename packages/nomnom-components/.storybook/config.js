import React from "react";
import { configure, setAddon, addDecorator } from "@storybook/react";
import infoAddon from "@storybook/addon-info";
import { ThemeProvider } from "styled-components";

import theme from "../src/theme";
import "../src/styles.js";

const req = require.context("../src", true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(story =>
  <ThemeProvider theme={theme}>
    {story()}
  </ThemeProvider>
);

setAddon(infoAddon);

configure(loadStories, module);
