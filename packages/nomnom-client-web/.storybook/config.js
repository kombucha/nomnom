import React from "react";
import { configure, setAddon, addDecorator } from "@storybook/react";
import infoAddon from "@storybook/addon-info";
import { ThemeProvider } from "styled-components";

import theme from "../src/theme";
import "../src/index.css";

const req = require.context("../src/components", true, /.stories.js$/);

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
