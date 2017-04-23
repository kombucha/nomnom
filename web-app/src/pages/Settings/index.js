import React, { Component } from "react";
import PrivacySettings from "./PrivacySettings";

const STYLES = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: 8
  },
  settingPanel: {
    minWidth: 600,
    maxWidth: 800
  }
};

export class Settings extends Component {
  render() {
    return (
      <div style={STYLES.container}>
        <PrivacySettings style={STYLES.settingPanel} />
      </div>
    );
  }
}

export default Settings;
