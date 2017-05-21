import React, { PureComponent } from "react";
import { gql, graphql } from "react-apollo";

import { Card, CardTitle } from "../../components/Card";
import FileInput from "../../components/FileInput";
import RaisedButton from "../../components/RaisedButton";

import importYoutubeSubscriptions from "../../services/youtube";

const DEFAULT_STATE = {
  showConfirmDelete: false,
  deleting: false,
  confirmationText: "",
  importing: false,
  importFiles: []
};

export class YoutubeSettings extends PureComponent {
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
      importYoutubeSubscriptions(importedFile).then(this.props.batchSubscribeToFeeds).then(() => {
        this.setState({ importing: false });
      });
    });
  }

  render() {
    const { importFiles, importing } = this.state;
    const enableImport = !importing && importFiles.length === 1;

    return (
      <Card>
        <CardTitle>Import Youtube Subscriptions</CardTitle>
        <p>
          Go to the
          {" "}
          <a
            href="https://www.youtube.com/subscription_manager#opml-export-container"
            target="_blank"
            rel="noopener noreferrer">
            Export settings
          </a>
          {" "}
          of your Youtube account and click on "Export subscriptions".
        </p>
        <p>
          Just drag and drop that file in the zone below
        </p>
        <FileInput onChange={this._handleFileChange} value={importFiles} />
        {" "}
        <br />
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

export const YoutubeSettingsWithMutation = graphql(addEntryMutation, {
  props: ({ mutate }) => ({
    batchSubscribeToFeeds: batchSubscribeToFeedsInput =>
      mutate({ variables: { batchSubscribeToFeedsInput } })
  })
})(YoutubeSettings);

export default YoutubeSettingsWithMutation;
