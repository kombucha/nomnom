import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import PropTypes from "prop-types";

import Dialog from "./Dialog";
import FlatButton from "./FlatButton";
import TextField from "./TextField";

class AddEntryDialog extends Component {
  constructor() {
    super();
    this.state = {
      entryUrl: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAddEntry = this.handleAddEntry.bind(this);
  }

  handleAddEntry() {
    const { entryUrl } = this.state;
    const { addUserEntry, onRequestClose } = this.props;

    addUserEntry(entryUrl).then(() => {
      this.setState({ entryUrl: "" });
      onRequestClose(true);
    });
  }

  handleChange(ev) {
    this.setState({ entryUrl: ev.target.value });
  }

  render() {
    const { entryUrl } = this.state;
    const { open, onRequestClose } = this.props;
    const actions = [
      <FlatButton secondary onClick={onRequestClose}>Cancel</FlatButton>,
      <FlatButton
        primary
        disabled={!entryUrl}
        onClick={() => this.handleAddEntry(this.state.entryUrl)}>
        Add
      </FlatButton>
    ];

    return (
      <Dialog title="Add entry" open={open} actions={actions} onRequestClose={onRequestClose}>
        <TextField hintText="Enter url" value={entryUrl} onChange={this.handleChange} autoFocus />
      </Dialog>
    );
  }
}

AddEntryDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
};

AddEntryDialog.defaultProps = {
  open: false
};

const addEntryMutation = gql`mutation addUserEntry($url: String!) {
  addUserEntry(url: $url) {id}
}`;

const AddEntryDialogWithMutation = graphql(addEntryMutation, {
  props: ({ mutate }) => ({
    addUserEntry: url =>
      mutate({
        variables: { url },
        update: (...args) => {
          console.log(args);
        }
      })
  })
})(AddEntryDialog);

export default AddEntryDialogWithMutation;
