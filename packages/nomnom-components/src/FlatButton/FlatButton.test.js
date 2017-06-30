import React from "react";
import ReactDOM from "react-dom";
import FlatButton from "./index.js";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<FlatButton />, div);
});
