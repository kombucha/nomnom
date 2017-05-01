import React from "react";
import { configure, setAddon, addDecorator } from "@kadira/storybook";
import infoAddon from "@kadira/react-storybook-addon-info";
import { ThemeProvider } from "styled-components";

import theme from "../src/theme";

function loadStories() {
  require("../src/stories");
}

addDecorator(story => (
  <ThemeProvider theme={theme}>
    {story()}
  </ThemeProvider>
));

setAddon(infoAddon);

configure(loadStories, module);
