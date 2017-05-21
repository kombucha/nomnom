import React, { PureComponent } from "react";
import { gql, graphql } from "react-apollo";
import PropTypes from "prop-types";

import Dialog from "./Dialog";
import FlatButton from "./FlatButton";
import TextField from "./TextField";

const DEFAULT_STATE = {
  feedName: "",
  feedUri: ""
};

export class SubscribeToFeedDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubscribeToFeed = this.handleSubscribeToFeed.bind(this);
  }

  handleSubscribeToFeed() {
    const { feedUri: uri, feedName: name } = this.state;
    const { subscribeToFeed, onRequestClose } = this.props;

    subscribeToFeed({ name, uri, type: "RSS" }).then(() => {
      this.setState(DEFAULT_STATE);
      onRequestClose(true);
    });
  }

  handleChange(name, ev) {
    this.setState({ [name]: ev.target.value });
  }

  render() {
    const { feedName, feedUri } = this.state;
    const { open, onRequestClose } = this.props;
    const disableSubscribe = !feedUri || !feedName;

    const actions = [
      <FlatButton secondary onClick={onRequestClose}>Cancel</FlatButton>,
      <FlatButton
        primary
        disabled={disableSubscribe}
        onClick={() => this.handleSubscribeToFeed(this.state.feedUri)}
      >
        Subscribe
      </FlatButton>
    ];

    return (
      <Dialog
        title="Subscribe to feed"
        open={open}
        actions={actions}
        onRequestClose={onRequestClose}
      >
        <TextField
          hintText="Name"
          value={feedName}
          onChange={ev => this.handleChange("feedName", ev)}
          autoFocus
        />
        <TextField
          hintText="URI"
          value={feedUri}
          onChange={ev => this.handleChange("feedUri", ev)}
        />
      </Dialog>
    );
  }
}

SubscribeToFeedDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
};

SubscribeToFeedDialog.defaultProps = {
  open: false
};

const subscribeToFeedMutation = gql`mutation subscribeToFeed($subscribeToFeedInput: SubscribeToFeedInput!) {
  subscribeToFeed(subscribeToFeedInput: $subscribeToFeedInput) { id }
}`;

const SubscribeToFeedDialogWithMutation = graphql(subscribeToFeedMutation, {
  props: ({ mutate }) => ({
    subscribeToFeed: subscribeToFeedInput =>
      mutate({ variables: { subscribeToFeedInput } })
  })
})(SubscribeToFeedDialog);

export default SubscribeToFeedDialogWithMutation;
