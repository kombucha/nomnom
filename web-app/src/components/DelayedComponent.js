import { Component } from "react";
import PropTypes from "prop-types";

export class DelayedComponent extends Component {
  state = {
    shouldRender: false
  };

  componentWillReceiveProps({ delay }) {
    this._scheduleRender(delay);
  }

  componentWillMount() {
    this._scheduleRender(this.props.delay);
  }

  componentWillUnmount() {
    this._clearTimer();
  }

  _scheduleRender(delay) {
    this._clearTimer();
    this.setState({ shouldRender: false });

    if (delay === undefined) {
      return;
    }

    this._timer = setTimeout(() => {
      this.setState({ shouldRender: true });
    }, delay);
  }

  _clearTimer() {
    if (this._timer) {
      window.clearTimeout(this._timer);
    }
  }

  render() {
    return this.state.shouldRender ? this.props.children : null;
  }
}

DelayedComponent.propTypes = {
  delay: PropTypes.number.isRequired
};

export default DelayedComponent;
