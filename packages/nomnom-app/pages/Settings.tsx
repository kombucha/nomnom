import React from "react";
import styled from "@emotion/styled";

import PageWrapper from "../components/PageWrapper";
import PageTitle from "../components/PageTitle";
import withAuth from "../components/hoc/withAuth";

import PrivacySettings from "../components/settings/PrivacySettings";
import PocketSettings from "../components/settings/PocketSettings";
import FeedbinFavoritesSettings from "../components/settings/FeedbinFavoritesSettings";
import FeedbinSubscriptionsSettings from "../components/settings/FeedbinSubscriptionsSettings";
import YoutubeSettings from "../components/settings/YoutubeSettings";
import BookmarkletSettings from "../components/settings/BookmarkletSettings";

const SettingsContainer = styled.div`
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

export const Settings = ({ loggedInUser }: any) => (
  <PageWrapper user={loggedInUser}>
    <SettingsContainer>
      <PageTitle value="Settings" />
      <BookmarkletSettings />
      <PocketSettings />
      <FeedbinFavoritesSettings />
      <FeedbinSubscriptionsSettings />
      <YoutubeSettings />
      <PrivacySettings />
    </SettingsContainer>
  </PageWrapper>
);

export default withAuth(Settings);
