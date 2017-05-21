import React from "react";
import { storiesOf } from "@storybook/react";
import { Menu, MenuItem, MenuContainer } from "../components/Menu";
import RaisedButton from "../components/RaisedButton";

storiesOf("Menu", module)
  .addWithInfo("basic", () => (
    <Menu>
      <MenuItem>One menu item</MenuItem>
      <MenuItem>Give me another one</MenuItem>
      <MenuItem>Another one</MenuItem>
      <MenuItem>Another one</MenuItem>
    </Menu>
  ))
  .addWithInfo("With menu button", () => (
    <MenuContainer target={<RaisedButton primary>Menu button</RaisedButton>}>
      <MenuItem>One menu item</MenuItem>
      <MenuItem>Give me another one</MenuItem>
      <MenuItem>Another one</MenuItem>
      <MenuItem>Another one</MenuItem>
    </MenuContainer>
  ));
