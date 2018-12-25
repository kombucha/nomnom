import { Component } from "preact";

interface Props {
  className?: string;
}

interface State {
  opened: boolean;
}

class SidePanel extends Component<Props, State> {
  state = { opened: true };

  handleTogglePanel = () => this.setState({ opened: !this.state.opened });

  render() {
    const { className, children } = this.props;
    const { opened } = this.state;
    const panelStyle = { transform: `translateX(${opened ? "0" : "100%"})` };

    return (
      <div
        className={`fixed pin-r pin-t h-screen p-4 border-l border-black bg-white ${className}`}
        style={panelStyle}>
        <button
          className="absolute pin-t pin-l-out p-2 border border-black"
          onClick={this.handleTogglePanel}>
          X
        </button>
        {children}
      </div>
    );
  }
}

export default SidePanel;
