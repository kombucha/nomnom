import React, { useState, useEffect } from "react";
import formatDate from "date-fns/format";
import styled from "@emotion/styled";
import { useRouter } from "next/router";

import FlatButton from "../toolkit/FlatButton";
import { Card, CardTitle } from "../toolkit/Card";

import withAuth from "../components/hoc/withAuth";
import PageTitle from "../components/PageTitle";
import KeyboardShortcuts from "../components/KeyboardShortcuts";
import ScrollPercentage from "../components/ScrollPercentage";
import PageWrapper from "../components/PageWrapper";
import EditEntryTagsDialog from "../components/EditEntryTagsDialog";
import useUserEntry from "../graphql/queries/userEntry";
import useEntryMutations from "../graphql/mutations/updateUserEntry";
import { setScrollPercent } from "../services/scrolling";
import { userEntry_userEntry } from "../apollo-types";
import { ThemeType } from "../toolkit/theme";

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const EntryCard = styled(Card)`
  max-width: 800px;
`;

const Article = styled.article`
  line-height: 1.5;

  .nomnom-youtube-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;

    > iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  p {
    text-align: justify;
  }

  img {
    max-width: 100%;
  }

  blockquote {
    font-style: italic;
  }

  pre {
    overflow-x: scroll;
  }
`;

const Meta = styled.div<{}, ThemeType>`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;

  color: ${props => props.theme.disabledColor};
  a {
    color: inherit;
  }
`;

const ProgressBar = styled.div<{}, ThemeType>`
  position: fixed;
  top: ${props => props.theme.appBarHeight};
  left: 0;
  height: 4px;
  background-color: ${props => props.theme.accent1Color};
  transition: width 500ms;
`;

const Loading = () => (
  <div>
    <PageTitle value="Loading entry..." />
    Loading...
  </div>
);

const UserEntry = ({ value: userEntry }: { value: userEntry_userEntry }) => {
  const [editingTags, setEditingTags] = useState(false);
  const { archive, favorite, updateProgress } = useEntryMutations(userEntry.id);

  useEffect(() => {
    // FIXME: Broken, need to take into account image loading because it affects the height !
    const progressPercent = userEntry.progress ? userEntry.progress / 100 : 0;
    const scrollTimeoutId = setTimeout(() => setScrollPercent(progressPercent), 100);
    return () => clearTimeout(scrollTimeoutId);
  }, [userEntry.id]);

  const toggleEditTags = () => setEditingTags(editing => !editing);
  const keyboardBindings = {
    a: archive,
    f: favorite,
    v: () => window.open(userEntry.entry.url, "_blank"),
    e: toggleEditTags
  };

  const htmlContent = { __html: userEntry.entry.content };
  const disableArchive = userEntry.status === "ARCHIVED";
  const disableFavorite = userEntry.status === "FAVORITE";
  const domain = new URL(userEntry.entry.url).host;
  const publicationDate = userEntry.entry.publicationDate
    ? new Date(userEntry.entry.publicationDate).toISOString()
    : "Unknown publication date";

  return (
    <KeyboardShortcuts bindings={keyboardBindings} global>
      <PageTitle value={userEntry.entry.title} />
      <ScrollPercentage onChange={updateProgress} />

      <ProgressBar style={{ width: `${userEntry.progress}%` }} />

      <EntryCard>
        <CardTitle>{userEntry.entry.title}</CardTitle>

        <Meta>
          {userEntry.entry.author && <span>By {userEntry.entry.author},</span>}
          <a target="_blank" rel="noopener noreferrer" href={userEntry.entry.url}>
            {domain}
          </a>
          <span>{formatDate(publicationDate, "MMMM Do, YYYY")}</span>
        </Meta>

        <Article dangerouslySetInnerHTML={htmlContent} />

        <div>
          <a href={userEntry.entry.url} target="__blank">
            <FlatButton>View original</FlatButton>
          </a>
          <FlatButton onClick={archive} disabled={disableArchive}>
            Archive
          </FlatButton>
          <FlatButton onClick={favorite} disabled={disableFavorite}>
            Favorite
          </FlatButton>
          <FlatButton onClick={toggleEditTags}>Edit tags</FlatButton>
        </div>
      </EntryCard>

      <EditEntryTagsDialog
        userEntryId={userEntry.id}
        open={editingTags}
        onRequestClose={toggleEditTags}
      />
    </KeyboardShortcuts>
  );
};

const UserEntryContainer = ({ loggedInUser }: any) => {
  const router = useRouter();
  const userEntryId = String(router.query.id);
  const { data, loading } = useUserEntry(userEntryId);

  return (
    <PageWrapper user={loggedInUser}>
      <Container>{loading ? <Loading /> : <UserEntry value={data.userEntry} />} </Container>
    </PageWrapper>
  );
};

export default withAuth(UserEntryContainer);
