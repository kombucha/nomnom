import React, { Component } from "react";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";

import { gql, graphql } from "react-apollo";

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
      <FlatButton label="Cancel" secondary onTouchTap={onRequestClose} />,
      <FlatButton
        label="Add"
        primary
        disabled={!entryUrl}
        onTouchTap={() => this.handleAddEntry(this.state.entryUrl)}
      />
    ];

    return (
      <Dialog
        title="Add entry"
        open={open}
        actions={actions}
        onRequestClose={onRequestClose}>
        <TextField
          hintText="Enter url"
          value={entryUrl}
          onChange={this.handleChange}
          fullWidth
          autoFocus
        />
      </Dialog>
    );
  }
}

AddEntryDialog.propTypes = {
  open: React.PropTypes.bool.isRequired,
  onRequestClose: React.PropTypes.func.isRequired
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
