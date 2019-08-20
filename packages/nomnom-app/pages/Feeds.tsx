import React, { useState } from "react";
import styled from "@emotion/styled";
import ContentAdd from "react-icons/lib/md/add";

import { Card } from "../toolkit/Card";
import FloatingActionButton from "../toolkit/FloatingActionButton";
import { List, ListItem } from "../toolkit/List";
import Toggle from "../toolkit/Toggle";

import withAuth from "../components/hoc/withAuth";
import PageWrapper from "../components/PageWrapper";
import PageTitle from "../components/PageTitle";
import SubscribeToFeedDialog from "../components/SubscribeToFeedDialog";
import useFeeds from "../graphql/queries/feeds";
import useToggleUserFeed from "../graphql/mutations/toggleUserFeed";
import { UserFeeds_me_feeds } from "../apollo-types";

const PageContainer = styled.div`
  padding: 16px;
`;

// TODO: refactor ListItem definition, a lot of duplication (padding, hover etc)
const FeedItem = styled(ListItem)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.098);
  }
`;
const FeedInfoSubtitle = styled.span`
  display: inline-block;
  font-size: 14px;
  line-height: 16px;
  height: 16px;
  color: rgba(0, 0, 0, 0.54);
`;
const FeedInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

type FeedItemRowProps = { value: UserFeeds_me_feeds };
const FeedItemRow = ({ value: userFeed }: FeedItemRowProps) => {
  const toggleUserFeed = useToggleUserFeed(userFeed.id);

  return (
    <FeedItem key={userFeed.id}>
      <FeedInfo>
        {userFeed.name}
        <FeedInfoSubtitle>{userFeed.feed.uri}</FeedInfoSubtitle>
      </FeedInfo>
      <Toggle value={userFeed.enabled} onChange={checked => toggleUserFeed(checked)} />
    </FeedItem>
  );
};

const FeedsPage = ({ loggedInUser }: any) => {
  const [showAddFeedDialog, setShowAddFeedDialog] = useState(false);
  const { data, refetch } = useFeeds();

  const handleDialogClose = (newFeedCreated: boolean) => {
    if (newFeedCreated) {
      refetch();
    }

    setShowAddFeedDialog(false);
  };

  return (
    <PageWrapper user={loggedInUser}>
      <PageContainer>
        <PageTitle value="Feeds" />
        <h1>Feeds</h1>
        <Card>
          <List>
            {data.me &&
              data.me.feeds.map(userFeed => <FeedItemRow key={userFeed.id} value={userFeed} />)}
          </List>
        </Card>

        <FloatingActionButton primary fixed onClick={() => setShowAddFeedDialog(true)}>
          <ContentAdd className="icon" />
        </FloatingActionButton>

        <SubscribeToFeedDialog open={showAddFeedDialog} onRequestClose={handleDialogClose} />
      </PageContainer>
    </PageWrapper>
  );
};

export default withAuth(FeedsPage);
