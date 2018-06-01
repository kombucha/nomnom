import React from "react";
import Mousetrap from "mousetrap";

class KeyboardShortcuts extends React.Component {
  static defaultProps = { bindings: {} };
  mousetrap = null;

  componentWillUnmount() {
    if (!process.browser) return;
  }

  bindMousetrap = el => {
    if (!process.browser) return;

    if (this.mousetrap) {
      this.mousetrap.reset();
    }

    const bindingElement = this.props.global ? document.documentElement : el;

    if (!bindingElement) return;

    this.mousetrap = new Mousetrap(bindingElement);
    this.mousetrap.stopCallback = (e, element) => {
      return (
        ["INPUT", "SELECT", "TEXTAREA"].includes(element.tagName) ||
        (element.contentEditable && element.contentEditable === "true")
      );
    };
    Object.entries(this.props.bindings).forEach(([seq, cb]) =>
      this.mousetrap.bind(seq, cb, "keyup")
    );
  };

  render() {
    return <div ref={this.bindMousetrap}>{this.props.children}</div>;
  }
}

export default KeyboardShortcuts;
