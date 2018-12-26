import { render, Component } from "preact";

import "./styles.css";

import SidePanel from "./components/SidePanel";
import Section from "./components/Section";
import ElementSelector from "./components/ElementSelector";

interface State {
  titleSelector: string;
  dateSelector: string;
  authorSelector: string;
}

class App extends Component<{}, State> {
  state = { titleSelector: "", dateSelector: "", authorSelector: "" };

  handleSelectorChange = (key: keyof State) => (value: string) =>
    this.setState({ [key]: value } as any);

  render() {
    const { titleSelector, dateSelector, authorSelector } = this.state;

    return (
      <SidePanel className="w-64">
        <Section title="Title">
          <ElementSelector
            value={titleSelector}
            onChange={this.handleSelectorChange("titleSelector")}
          />
        </Section>
        <Section title="Date">
          <ElementSelector
            value={dateSelector}
            onChange={this.handleSelectorChange("dateSelector")}
          />
        </Section>
        <Section title="Author">
          <ElementSelector
            value={authorSelector}
            onChange={this.handleSelectorChange("authorSelector")}
          />
        </Section>
      </SidePanel>
    );
  }
}

const container = document.getElementById("sidebar");

if (container) {
  render(<App />, container);
}
