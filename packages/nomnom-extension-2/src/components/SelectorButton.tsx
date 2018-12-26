import { Component } from "preact";

interface Props {
  onSelected: (el: HTMLElement) => any;
  exceptElements?: (HTMLElement | string)[];
}

interface State {
  selecting: boolean;
}

class SelectorButton extends Component<Props, State> {
  static defaultProps: Partial<Props> = { exceptElements: ["#sidebar"] };
  state: State = { selecting: false };

  hoveredElement?: HTMLElement;
  hoveredElementOriginalOutline?: string;

  handleToggleSelectMode = () => {
    this.cleanUpElement();
    if (this.state.selecting) {
      document.removeEventListener("mouseover", this.onElementOver);
      this.setState({ selecting: false });
    } else {
      document.addEventListener("mouseover", this.onElementOver);
      this.setState({ selecting: true });
    }
  };

  cleanUpElement = () => {
    if (!this.hoveredElement) return;
    this.hoveredElement.removeEventListener("click", this.onElementClick, true);
    this.hoveredElement.style.outline = this.hoveredElementOriginalOutline;
    this.hoveredElement = this.hoveredElementOriginalOutline = undefined;
  };

  isExcluded = (el: HTMLElement) =>
    this.props.exceptElements.some(
      ex => (typeof ex === "string" ? document.querySelector(ex).contains(el) : ex.contains(el))
    );

  onElementOver = (evt: MouseEvent) => {
    this.cleanUpElement();

    if (this.isExcluded(evt.target as HTMLElement)) return;

    this.hoveredElement = evt.target as HTMLElement;
    this.hoveredElementOriginalOutline = this.hoveredElement.style.outline;
    this.hoveredElement.style.outline = "1px solid red";
    this.hoveredElement.addEventListener("click", this.onElementClick, true);
  };

  onElementClick = (evt: MouseEvent) => {
    evt.preventDefault();
    this.props.onSelected(this.hoveredElement);
    this.handleToggleSelectMode();
  };

  render() {
    return <button onClick={this.handleToggleSelectMode}>select</button>;
  }
}

export default SelectorButton;
