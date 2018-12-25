import { render } from "preact";

import "./styles.css";
import SidePanel from "./components/SidePanel";
import Section from "./components/Section";

const App = () => (
  <SidePanel className="w-64">
    <Section title="Title">title</Section>
    <Section title="Date">date</Section>
    <Section title="Author">author</Section>
    <Section title="Content">content</Section>
  </SidePanel>
);

const container = document.getElementById("sidebar");

if (container) {
  render(<App />, container);
}
