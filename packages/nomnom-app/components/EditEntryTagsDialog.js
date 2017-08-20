import React, { PureComponent } from "react";
import { gql, graphql, compose } from "react-apollo";
import PropTypes from "prop-types";

import Dialog from "../toolkit/Dialog";
import ChipInput from "../toolkit/ChipInput";
import FlatButton from "../toolkit/FlatButton";
import updateUserEntryContainer from "../graphql/mutations/updateUserEntry";

const DEFAULT_STATE = {
  newTags: [],
  enableSave: false
};

export class EditEntryTagsDialog extends PureComponent {
  state = DEFAULT_STATE;

  componentWillReceiveProps(newProps) {
    if (newProps.data && !newProps.data.loading) {
      this.setState({ newTags: newProps.data.userEntry.tags });
    }
  }

  _handleSave = () => {
    const { newTags } = this.state;
    const { userEntryId, updateUserEntry, onRequestClose } = this.props;

    const updateParams = { id: userEntryId, tags: newTags };
    updateUserEntry(updateParams).then(() => {
      this.setState(DEFAULT_STATE);
      onRequestClose(true);
    });
  };

  _handleChange = newTags => this.setState({ newTags, enableSave: true });

  render() {
    const { open, onRequestClose, data } = this.props;
    const { newTags, enableSave } = this.state;
    const loading = !data || data.loading;

    const actions = [
      <FlatButton secondary onClick={onRequestClose}>
        Cancel
      </FlatButton>,
      <FlatButton primary disabled={!enableSave} onClick={this._handleSave}>
        Save
      </FlatButton>
    ];

    return (
      <Dialog title="Edit tags entry" open={open} actions={actions} onRequestClose={onRequestClose}>
        <ChipInput
          hintText="Enter new tags"
          value={newTags}
          onChange={this._handleChange}
          disabled={loading}
        />
      </Dialog>
    );
  }
}

EditEntryTagsDialog.propTypes = {
  userEntryId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
};

EditEntryTagsDialog.defaultProps = {
  open: false
};

// TODO: read doc about fragment so that queries are merged...
// http://dev.apollodata.com/core/fragments.html
const query = gql`
  query userEntry($userEntryId: ID!) {
    userEntry(userEntryId: $userEntryId) {
      id
      tags
    }
  }
`;
const withQuery = graphql(query, {
  skip: props => !props.open,
  options: ({ userEntryId }) => ({
    variables: { userEntryId }
  })
});

export default compose(withQuery, updateUserEntryContainer)(EditEntryTagsDialog);
