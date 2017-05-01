import React from "react";
import styled from "styled-components";
import PrivacySettings from "./PrivacySettings";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 16px;

  > div {
    min-width: 600px;
    max-width: 800px;
  }
`;

export const Settings = () => (
  <Container>
    <PrivacySettings />
  </Container>
);

export default Settings;
