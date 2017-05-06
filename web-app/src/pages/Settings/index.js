import React from "react";
import styled from "styled-components";
import PrivacySettings from "./PrivacySettings";
import PocketSettings from "./PocketSettings";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 16px;

  > div, > section {
    min-width: 600px;
    max-width: 800px;
    margin-bottom: 16px;
  }
`;

export const Settings = () => (
  <Container>
    <PrivacySettings />
    <PocketSettings />
  </Container>
);

export default Settings;
