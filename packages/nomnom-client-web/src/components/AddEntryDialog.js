import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import Dialog from "nomnom-components/lib/Dialog";
import FlatButton from "nomnom-components/lib/FlatButton";
import TextField from "nomnom-components/lib/TextField";
import addUserEntryMutation from "../graphql/mutations/addUserEntry";

class AddEntryDialog extends PureComponent {
  constructor() {
    super();
    this.state = {
      entryUrl: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAddEntry = this.handleAddEntry.bind(this);
  }

  handleAddEntry() {
    const { entryUrl: url } = this.state;
    const { addUserEntry, onRequestClose } = this.props;

    addUserEntry({ url }).then(() => {
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
      <FlatButton secondary onClick={onRequestClose}>
        Cancel
      </FlatButton>,
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
  onRequestClose: PropTypes.func.isRequired,
  addUserEntry: PropTypes.func.isRequired
};

AddEntryDialog.defaultProps = {
  open: false
};

export default addUserEntryMutation(AddEntryDialog);
