import React from "react";
import { storiesOf } from "@storybook/react";
import { Card, CardTitle } from "../components/Card";

const storyBookStyle = {
  maxWidth: 800,
  margin: 16
};

storiesOf("Card", module)
  .addWithInfo("basic", () => <Card style={storyBookStyle}>Wow, amazing card !</Card>)
  .addWithInfo("with a title", () =>
    <Card style={storyBookStyle}>
      <CardTitle>The card title</CardTitle>
      Wow, amazing card !
    </Card>
  )
  .addWithInfo("with no padding", () =>
    <Card style={storyBookStyle} fullBleed>
      <CardTitle>The card title</CardTitle>
      <img src="http://placekitten.com/g/800/500" alt="" />
    </Card>
  );
