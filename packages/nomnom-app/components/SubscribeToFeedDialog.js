import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import Dialog from "../toolkit/Dialog";
import FlatButton from "../toolkit/FlatButton";
import TextField from "../toolkit/TextField";
import subscribeToFeedContainer from "../graphql/mutations/subscribeToFeed";

const DEFAULT_STATE = {
  feedName: "",
  feedUri: ""
};

export class SubscribeToFeedDialog extends PureComponent {
  state = DEFAULT_STATE;

  handleSubscribeToFeed = () => {
    const { feedUri: uri, feedName: name } = this.state;
    const { subscribeToFeed, onRequestClose } = this.props;

    subscribeToFeed({ name, uri, type: "RSS" }).then(() => {
      this.setState(DEFAULT_STATE);
      onRequestClose(true);
    });
  };

  _handleChange = name => ev => {
    this.setState({ [name]: ev.target.value });
  };

  render() {
    const { feedName, feedUri } = this.state;
    const { open, onRequestClose } = this.props;
    const disableSubscribe = !feedUri || !feedName;

    const actions = [
      <FlatButton secondary onClick={onRequestClose}>
        Cancel
      </FlatButton>,
      <FlatButton
        primary
        disabled={disableSubscribe}
        onClick={() => this.handleSubscribeToFeed(this.state.feedUri)}>
        Subscribe
      </FlatButton>
    ];

    return (
      <Dialog
        title="Subscribe to feed"
        open={open}
        actions={actions}
        onRequestClose={onRequestClose}>
        <TextField
          hintText="Name"
          value={feedName}
          onChange={this._handleChange("feedName")}
          autoFocus
        />
        <TextField hintText="URI" value={feedUri} onChange={this._handleChange("feedUri")} />
      </Dialog>
    );
  }
}

SubscribeToFeedDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  subscribeToFeed: PropTypes.func.isRequired
};

SubscribeToFeedDialog.defaultProps = {
  open: false
};

export default subscribeToFeedContainer(SubscribeToFeedDialog);
