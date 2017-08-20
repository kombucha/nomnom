import React, { PureComponent } from "react";

import { Card, CardTitle } from "../toolkit/Card";
import RaisedButton from "../toolkit/RaisedButton";

import FileInput from "../../components/FileInput";
import batchSubscribeToFeedsContainer from "../../graphql/mutations/batchSubscribeToFeeds";

import { importSubscriptions } from "../../services/feedbin";

const DEFAULT_STATE = {
  showConfirmDelete: false,
  deleting: false,
  confirmationText: "",
  importing: false,
  importFiles: []
};

export class FeedbinSubscriptionsSettings extends PureComponent {
  state = DEFAULT_STATE;

  _handleFileChange = importFiles => {
    this.setState({ importFiles });
  };

  _handleImport = () => {
    // Can be quite long !
    this.setState({ importing: true }, () => {
      const importedFile = this.state.importFiles[0];
      importSubscriptions(importedFile).then(this.props.batchSubscribeToFeeds).then(() => {
        this.setState({ importing: false });
      });
    });
  };

  render() {
    const { importFiles, importing } = this.state;
    const enableImport = !importing && importFiles.length === 1;

    return (
      <Card>
        <CardTitle>Import Feedbin Subscriptions</CardTitle>
        <p>
          Go to the
          <a
            href="https://feedbin.com/settings/import_export"
            rel="noopener noreferrer"
            target="_blank">
            Export settings
          </a>
          of your Feedbin account and click on "Download".
        </p>
        <p>You will receive an email with the exported file.</p>
        <p>Just drag and drop that file in the zone below</p>
        <FileInput onChange={this._handleFileChange} value={importFiles} /> <br />
        <RaisedButton primary disabled={!enableImport} onClick={this._handleImport}>
          {importing ? "Importing..." : "Import"}
        </RaisedButton>
      </Card>
    );
  }
}

export default batchSubscribeToFeedsContainer(FeedbinSubscriptionsSettings);
