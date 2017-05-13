import React from "react";
import styled from "styled-components";

import PageTitle from "../../components/PageTitle";
import PrivacySettings from "./PrivacySettings";
import PocketSettings from "./PocketSettings";
import FeedbinFavoritesSettings from "./FeedbinFavoritesSettings";
import FeedbinSubscriptionsSettings from "./FeedbinSubscriptionsSettings";
import YoutubeSettings from "./YoutubeSettings";
import BookmarkletSettings from "./BookmarkletSettings";

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
    <PageTitle value="Settings" />
    <BookmarkletSettings />
    <PocketSettings />
    <FeedbinFavoritesSettings />
    <FeedbinSubscriptionsSettings />
    <YoutubeSettings />
    <PrivacySettings />
  </Container>
);

export default Settings;
