import React from "react";
import { configure, setAddon, addDecorator } from "@storybook/react";
import infoAddon from "@storybook/addon-info";

import StylesWrapper from "../toolkit/StylesWrapper";

const req = require.context("../toolkit", true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(story => <StylesWrapper>{story()}</StylesWrapper>);

setAddon(infoAddon);

configure(loadStories, module);
