import React, { Component } from "react";
import { Card, CardHeader, CardText } from "material-ui/Card";
import ActionDelete from "material-ui/svg-icons/action/delete";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import Dialog from "material-ui/Dialog";
import CircularProgress from "material-ui/CircularProgress";
import FlatButton from "material-ui/FlatButton";
import { gql, graphql } from "react-apollo";

const CONFIRMATION_TEXT = "Ya, I'm sure";
const STYLES = {
  confirmationText: {
    userSelect: "none"
  }
};

const DEFAULT_STATE = {
  showConfirmDelete: false,
  deleting: false,
  confirmationText: ""
};

export class PrivacySettings extends Component {
  constructor() {
    super();
    this.state = DEFAULT_STATE;
  }

  _doDelete() {
    return new Promise((resolve, reject) => {
      this.setState({ deleting: true }, () => {
        this.props.deleteAllMyEntries().then(resolve, reject);
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
    const handleDismissDialog = () =>
      (deleting ? null : this._handleConfirmDelete(false));
    const updateConfirmationText = (e, value) =>
      this.setState({
        confirmationText: value
      });

    const actions = [
      <FlatButton
        label="Cancel"
        secondary
        disabled={deleting}
        onTouchTap={() => this._handleConfirmDelete(false)}
      />,
      deleting
        ? <FlatButton
            label="Deleting"
            primary
            disabled
            labelPosition="before"
            icon={<CircularProgress size={24} />}
          />
        : <FlatButton
            label="Delete"
            primary
            disabled={confirmationText !== CONFIRMATION_TEXT}
            onTouchTap={() => this._handleConfirmDelete(true)}
          />
    ];

    return (
      <div style={this.props.style}>
        <Card>
          <CardHeader title="Privacy" />
          <CardText>
            <RaisedButton
              label="Clear all my content"
              icon={<ActionDelete />}
              secondary
              onTouchTap={showConfirmDelete}
            />
          </CardText>
        </Card>
        <Dialog
          title="Clearing content"
          actions={actions}
          modal={false}
          open={this.state.showConfirmDelete}
          onRequestClose={handleDismissDialog}>
          <p>Are you sure you want to delete all your content ?</p>
          <p>
            Type "
            <b style={STYLES.confirmationText}>{CONFIRMATION_TEXT}</b>
            " to confirm
          </p>
          <TextField
            floatingLabelText="confirmation"
            autoFocus
            value={confirmationText}
            disabled={deleting}
            onChange={updateConfirmationText}
          />
        </Dialog>
      </div>
    );
  }
}

const addEntryMutation = gql`mutation deleteAllMyEntries { deleteAllMyEntries }`;

const PrivacySettingsWithMutation = graphql(addEntryMutation, {
  props: ({ mutate }) => ({
    deleteAllMyEntries: () => mutate()
  })
})(PrivacySettings);

export default PrivacySettingsWithMutation;
