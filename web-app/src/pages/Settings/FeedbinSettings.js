import React, { PureComponent } from "react";
import { gql, graphql } from "react-apollo";

import { Card, CardTitle } from "../../components/Card";
import FileInput from "../../components/FileInput";
import RaisedButton from "../../components/RaisedButton";

import feedbin from "../../services/feedbin";

const DEFAULT_STATE = {
  showConfirmDelete: false,
  deleting: false,
  confirmationText: "",
  importing: false,
  importFiles: []
};

export class FeedbinSettings extends PureComponent {
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
      const favoritesFile = this.state.importFiles[0];
      feedbin.importFavorites(favoritesFile).then(this.props.batchAddUserEntries).then(() => {
        this.setState({ importing: false });
      });
    });
  }

  render() {
    const { importFiles, importing } = this.state;
    const enableImport = !importing && importFiles.length === 1;

    return (
      <Card>
        <CardTitle>Import from feedbin</CardTitle>
        <p>
          Go to the
          {" "}
          <a href="https://feedbin.com/settings/import_export" target="_blank">Export settings</a>
          {" "}
          of your Feedbin account and click on "Export starred articles".
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

const addEntryMutation = gql`mutation batchAddUserEntries($batchAddUserEntriesInput: [AddUserEntryInput!]!) {
  batchAddUserEntries(batchAddUserEntriesInput: $batchAddUserEntriesInput) { id }
}`;

export const FeedbinSettingsWithMutation = graphql(addEntryMutation, {
  props: ({ mutate }) => ({
    batchAddUserEntries: batchAddUserEntriesInput =>
      mutate({ variables: { batchAddUserEntriesInput } })
  })
})(FeedbinSettings);

export default FeedbinSettingsWithMutation;
