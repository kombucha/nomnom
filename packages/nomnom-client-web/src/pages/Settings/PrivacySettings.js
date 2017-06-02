import React, { PureComponent } from "react";
import ActionDelete from "react-icons/lib/md/delete";
import styled from "styled-components";

import Dialog from "../../components/Dialog";
import TextField from "../../components/TextField";
import FlatButton from "../../components/FlatButton";
import RaisedButton from "../../components/RaisedButton";
import { Card, CardTitle } from "../../components/Card";
import deleteAllMyDataContainer from "../../graphql/mutations/deleteAllMyData";

const CONFIRMATION_TEXT = "Ya, I'm sure";
const ConfirmationText = styled.b`user-select: none;`;

const DEFAULT_STATE = {
  showConfirmDelete: false,
  deleting: false,
  confirmationText: ""
};

export class PrivacySettings extends PureComponent {
  constructor() {
    super();
    this.state = DEFAULT_STATE;
  }

  _doDelete() {
    return new Promise((resolve, reject) => {
      this.setState({ deleting: true }, () => {
        this.props.deleteAllMyData().then(resolve, reject);
      });
    });
  }

  _reset() {
    this.setState(DEFAULT_STATE);
  }

  _handleConfirmDelete(confirmed) {
    const actionPromise = confirmed ? this._doDelete() : Promise.resolve();
    // TODO: handle failure
    actionPromise.then(() => this._reset(), () => this._reset());
  }

  render() {
    const { confirmationText, deleting } = this.state;
    const showConfirmDelete = () => this.setState({ showConfirmDelete: true });
    const handleDismissDialog = () => (deleting ? null : this._handleConfirmDelete(false));
    const updateConfirmationText = ev =>
      this.setState({
        confirmationText: ev.target.value
      });

    const actions = [
      <FlatButton secondary disabled={deleting} onClick={() => this._handleConfirmDelete(false)}>
        Cancel
      </FlatButton>,
      deleting
        ? <FlatButton primary disabled>
            <span>Deleting</span>
            {/* TODO: <CircularProgress size={24} />*/}
          </FlatButton>
        : <FlatButton
            primary
            disabled={confirmationText !== CONFIRMATION_TEXT}
            onClick={() => this._handleConfirmDelete(true)}>
            Delete
          </FlatButton>
    ];

    return (
      <div>
        <Card>
          <CardTitle>Privacy</CardTitle>

          <RaisedButton secondary onClick={showConfirmDelete}>
            <ActionDelete className="icon" />
            <span>Clear all my content</span>
          </RaisedButton>

        </Card>
        <Dialog
          title="Clearing content"
          actions={actions}
          modal={false}
          open={this.state.showConfirmDelete}
          onRequestClose={handleDismissDialog}>
          <p>
            Are you sure you want to delete all your content (entries, feeds) ?
          </p>
          <p>
            Type "
            <ConfirmationText>{CONFIRMATION_TEXT}</ConfirmationText>
            " to confirm
          </p>
          <TextField
            autoFocus
            value={confirmationText}
            hintText="confirmation"
            onChange={updateConfirmationText}
            disabled={deleting}
          />
        </Dialog>
      </div>
    );
  }
}

export default deleteAllMyDataContainer(PrivacySettings);
