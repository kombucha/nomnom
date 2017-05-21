import { Component } from "react";
import PropTypes from "prop-types";

let titleQueue = [];

function removeFromQueue(component) {
  titleQueue = titleQueue.filter(item => item.component !== component);
  onQueueUpdate();
}

function pushToQueue(component, title) {
  titleQueue.push({ component, title });
  onQueueUpdate();
}

function updateInQueue(component, title) {
  const item = titleQueue.find(item => item.component === component);
  item.title = title;
  onQueueUpdate();
}

function onQueueUpdate() {
  const last = titleQueue[titleQueue.length - 1];
  document.title = last.title;
}

export class PageTitle extends Component {
  componentWillMount() {
    pushToQueue(this, this.props.value);
  }

  componentWillReceiveProps() {
    updateInQueue(this, this.props.value);
  }

  componentWillUnmount() {
    removeFromQueue(this);
  }
  render() {
    return null;
  }
}

PageTitle.propTypes = {
  value: PropTypes.string.isRequired
};

export default PageTitle;
