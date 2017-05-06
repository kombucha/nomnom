import React from "react";
import { storiesOf, action } from "@kadira/storybook";
import FloatingActionButton from "../components/FloatingActionButton";
import ContentAdd from "react-icons/lib/md/add";

storiesOf("Floating Action Button", module)
  .addWithInfo("with text", () => (
    <div>
      <FloatingActionButton onClick={action("clicked")}>
        <ContentAdd className="icon" />
      </FloatingActionButton>
      <FloatingActionButton primary onClick={action("clicked")}>
        <ContentAdd className="icon" />
      </FloatingActionButton>
      <FloatingActionButton secondary onClick={action("clicked")}>
        +
      </FloatingActionButton>
    </div>
  ))
  .addWithInfo("with some emoji", () => (
    <FloatingActionButton onClick={action("clicked")}>👍</FloatingActionButton>
  ))
  .addWithInfo("fixed", () => (
    <div>
      Look down !
      <FloatingActionButton onClick={action("clicked")} fixed>😀</FloatingActionButton>
    </div>
  ));
