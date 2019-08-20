import { Component } from "react";
import PropTypes from "prop-types";
import debounce from "lodash/debounce";
import { getScrollPercent } from "../services/scrolling";

export class ScrollPercentage extends Component {
  shouldComponentUpdate() {
    return false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.onChange !== this.props.onChange) {
      this.props.onChange(getScrollPercent());
    }
  }

  componentDidMount() {
    if (!process.browser) {
      return;
    }

    global.addEventListener("scroll", this._updateScrollPercentage);
    global.addEventListener("resize", this._updateScrollPercentage);
  }

  componentWillUnmount() {
    if (!process.browser) {
      return;
    }

    global.removeEventListener("scroll", this._updateScrollPercentage);
    global.removeEventListener("resize", this._updateScrollPercentage);
  }

  _updateScrollPercentage = debounce(() => {
    this.props.onChange(getScrollPercent());
  }, 250);

  render() {
    return null;
  }
}

ScrollPercentage.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default ScrollPercentage;
