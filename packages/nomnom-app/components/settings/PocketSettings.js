import React, { PureComponent } from "react";

import { Card, CardTitle } from "../../toolkit/Card";
import RaisedButton from "../../toolkit/RaisedButton";
import FileInput from "../../components/FileInput";
import batchAddUserEntriesContainer from "../../graphql/mutations/batchAddUserEntries";

import importPocket from "../../services/pocket";

const DEFAULT_STATE = {
  showConfirmDelete: false,
  deleting: false,
  confirmationText: "",
  importing: false,
  importFiles: []
};

export class PocketSettings extends PureComponent {
  state = DEFAULT_STATE;

  _handleFileChange = importFiles => {
    this.setState({ importFiles });
  };

  _handleImport = () => {
    // Can be quite long !
    this.setState({ importing: true }, () => {
      importPocket(this.state.importFiles[0])
        .then(this.props.batchAddUserEntries)
        .then(() => {
          this.setState({ importing: false });
        });
    });
  };

  render() {
    const { importFiles, importing } = this.state;
    const enableImport = !importing && importFiles.length === 1;

    return (
      <Card>
        <CardTitle>Import from pocket</CardTitle>
        <p>
          Go to the{" "}
          <a href="https://getpocket.com/export" rel="noopener noreferrer" target="_blank">
            Export settings
          </a>{" "}
          of your Pocket account and click on "Export HTML file".
        </p>
        <p>Then drag and drop that file in the zone below</p>
        <FileInput onChange={this._handleFileChange} value={importFiles} /> <br />
        <RaisedButton primary disabled={!enableImport} onClick={this._handleImport}>
          {importing ? "Importing..." : "Import"}
        </RaisedButton>
      </Card>
    );
  }
}

export default batchAddUserEntriesContainer(PocketSettings);
