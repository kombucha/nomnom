import React from "react";
import styled from "styled-components";

import App from "../components/App";
import PageTitle from "../components/PageTitle";
import withData from "../components/withData";

import PrivacySettings from "../components/settings/PrivacySettings";
import PocketSettings from "../components/settings/PocketSettings";
import FeedbinFavoritesSettings from "../components/settings/FeedbinFavoritesSettings";
import FeedbinSubscriptionsSettings from "../components/settings/FeedbinSubscriptionsSettings";
import YoutubeSettings from "../components/settings/YoutubeSettings";
import BookmarkletSettings from "../components/settings/BookmarkletSettings";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 16px;

  > div,
  > section {
    width: 75%;
    max-width: 800px;
    margin-bottom: 16px;
  }
`;

export const Settings = () =>
  <App>
    <Container>
      <PageTitle value="Settings" />
      <BookmarkletSettings />
      <PocketSettings />
      <FeedbinFavoritesSettings />
      <FeedbinSubscriptionsSettings />
      <YoutubeSettings />
      <PrivacySettings />
    </Container>
  </App>;

export default withData(Settings);
