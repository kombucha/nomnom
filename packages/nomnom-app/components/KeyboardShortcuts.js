import React from "react";
import Mousetrap from "mousetrap";

class KeyboardShortcuts extends React.Component {
  static defaultProps = { bindings: {} };
  mousetrap = null;

  componentWillUnmount() {
    if (!process.browser) return;
    this._reset();
  }

  _reset = () => {
    if (this.mousetrap) {
      this.mousetrap.reset();
    }
  };

  _bindMousetrap = el => {
    this._reset();

    if (!process.browser || !el) return;

    const bindingElement = this.props.global ? document.documentElement : el;

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
    return <div ref={this._bindMousetrap}>{this.props.children}</div>;
  }
}

export default KeyboardShortcuts;
