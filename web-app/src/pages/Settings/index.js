import React from "react";
import styled from "styled-components";
import PrivacySettings from "./PrivacySettings";
import PocketSettings from "./PocketSettings";
import FeedbinSettings from "./FeedbinSettings";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 16px;

  > div, > section {
    width: 75%;
    max-width: 800px;
    margin-bottom: 16px;
  }
`;

export const Settings = () => (
  <Container>
    <PrivacySettings />
    <PocketSettings />
    <FeedbinSettings />
  </Container>
);

export default Settings;
