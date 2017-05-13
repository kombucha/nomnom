import React, { PureComponent } from "react";
import { gql, graphql } from "react-apollo";

import { Card, CardTitle } from "../../components/Card";
import FileInput from "../../components/FileInput";
import RaisedButton from "../../components/RaisedButton";

import { importSubscriptions } from "../../services/feedbin";

const DEFAULT_STATE = {
  showConfirmDelete: false,
  deleting: false,
  confirmationText: "",
  importing: false,
  importFiles: []
};

export class FeedbinSubscriptionsSettingsWithMutation extends PureComponent {
  constructor() {
    super();
    this.state = DEFAULT_STATE;
    this._handleFileChange = this._handleFileChange.bind(this);
    this._handleImport = this._handleImport.bind(this);
  }

  _handleFileChange(importFiles) {
    this.setState({ importFiles });
  }

  _handleImport() {
    // Can be quite long !
    this.setState({ importing: true }, () => {
      const importedFile = this.state.importFiles[0];
      importSubscriptions(importedFile).then(this.props.batchSubscribeToFeeds).then(() => {
        this.setState({ importing: false });
      });
    });
  }

  render() {
    const { importFiles, importing } = this.state;
    const enableImport = !importing && importFiles.length === 1;

    return (
      <Card>
        <CardTitle>Import Feedbin Subscriptions</CardTitle>
        <p>
          Go to the
          {" "}
          <a href="https://feedbin.com/settings/import_export" target="_blank">Export settings</a>
          {" "}
          of your Feedbin account and click on "Download".
        </p>
        <p>You will receive an email with the exported file.</p>
        <p>
          Just drag and drop that file in the zone below
        </p>
        <FileInput onChange={this._handleFileChange} value={importFiles} /> <br />
        <RaisedButton primary disabled={!enableImport} onClick={this._handleImport}>
          {importing ? "Importing..." : "Import"}
        </RaisedButton>
      </Card>
    );
  }
}

const addEntryMutation = gql`mutation batchSubscribeToFeeds($batchSubscribeToFeedsInput: [SubscribeToFeedInput!]!) {
  batchSubscribeToFeeds(batchSubscribeToFeedsInput: $batchSubscribeToFeedsInput) { id }
}`;

export const FeedbinSubscriptionsSettingsWithMutationWithMutation = graphql(addEntryMutation, {
  props: ({ mutate }) => ({
    batchSubscribeToFeeds: batchSubscribeToFeedsInput =>
      mutate({ variables: { batchSubscribeToFeedsInput } })
  })
})(FeedbinSubscriptionsSettingsWithMutation);

export default FeedbinSubscriptionsSettingsWithMutationWithMutation;
