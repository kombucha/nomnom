import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import Dialog from "../toolkit/Dialog";
import FlatButton from "../toolkit/FlatButton";
import TextField from "../toolkit/TextField";
import addUserEntryMutation from "../graphql/mutations/addUserEntry";

class AddEntryDialog extends PureComponent {
  state = { entryUrl: "" };

  _handleAddEntry = () => {
    const { entryUrl: url } = this.state;
    const { addUserEntry, onRequestClose } = this.props;

    addUserEntry({ url }).then(() => {
      this.setState({ entryUrl: "" });
      onRequestClose(true);
    });
  };

  _handleChange = ev => this.setState({ entryUrl: ev.target.value });

  render() {
    const { entryUrl } = this.state;
    const { open, onRequestClose } = this.props;
    const actions = [
      <FlatButton secondary onClick={onRequestClose}>
        Cancel
      </FlatButton>,
      <FlatButton primary disabled={!entryUrl} onClick={this._handleAddEntry}>
        Add
      </FlatButton>
    ];

    return (
      <Dialog title="Add entry" open={open} actions={actions} onRequestClose={onRequestClose}>
        <TextField hintText="Enter url" value={entryUrl} onChange={this._handleChange} autoFocus />
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
