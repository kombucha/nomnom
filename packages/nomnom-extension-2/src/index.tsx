import { render } from "preact";

import "./styles.css";

const App = () => (
  <div className="text-black border border-black rounded m-2 p-10 shadow">Hello world!</div>
);

render(<App />, document.getElementById("sidebar"));
