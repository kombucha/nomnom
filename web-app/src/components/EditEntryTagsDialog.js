import React, { Component } from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import ChipInput from "material-ui-chip-input";

import { gql, graphql, compose } from "react-apollo";

const DEFAULT_STATE = {
  newTags: [],
  enableSave: false
};

export class EditEntryTagsDialog extends Component {
  constructor() {
    super();
    this.state = DEFAULT_STATE;

    this._handleChange = this._handleChange.bind(this);
    this._handleSave = this._handleSave.bind(this);
  }

  _handleSave() {
    const { newTags } = this.state;
    const { userEntryId, updateUserEntryTags, onRequestClose } = this.props;

    const updateParams = { id: userEntryId, tags: newTags };
    updateUserEntryTags(updateParams).then(() => {
      this.setState(DEFAULT_STATE);
      onRequestClose(true);
    });
  }

  _handleChange(newTags) {
    this.setState({ newTags, enableSave: true });
  }

  render() {
    const { open, onRequestClose, data: { loading, userEntry } } = this.props;
    const { enableSave } = this.state;
    const actions = [
      <FlatButton label="Cancel" secondary onClick={onRequestClose} />,
      <FlatButton label="Save" primary disabled={!enableSave} onClick={this._handleSave} />
    ];

    return (
      <Dialog title="Edit tags entry" open={open} actions={actions} onRequestClose={onRequestClose}>
        {loading ? null : <ChipInput defaultValue={userEntry.tags} onChange={this._handleChange} />}
      </Dialog>
    );
  }
}

EditEntryTagsDialog.propTypes = {
  userEntryId: React.PropTypes.string.isRequired,
  open: React.PropTypes.bool.isRequired,
  onRequestClose: React.PropTypes.func.isRequired
};

EditEntryTagsDialog.defaultProps = {
  open: false
};

// TODO: read doc about fragment so that queries are merged...
// http://dev.apollodata.com/core/fragments.html
const query = gql`query userEntry($userEntryId: ID!) {
  userEntry(userEntryId: $userEntryId) { id tags }
}`;
const mutation = gql`mutation updateUserEntry($entryUpdateInput: EntryUpdateInput!) {
  updateUserEntry(entryUpdateInput: $entryUpdateInput) {id tags lastUpdateDate}
}`;

const withQuery = graphql(query, {
  options: ({ userEntryId }) => ({
    variables: { userEntryId }
  })
});
const withMutation = graphql(mutation, {
  props: ({ mutate }) => ({
    updateUserEntryTags: entryUpdateInput => mutate({ variables: { entryUpdateInput } })
  })
});

export default compose(withQuery, withMutation)(EditEntryTagsDialog);
