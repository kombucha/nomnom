import React, { Component } from "react";
import styled from "styled-components";
import ContentAdd from "react-icons/lib/md/add";

import PageTitle from "../components/PageTitle";
import FloatingActionButton from "../components/FloatingActionButton";
import Toggle from "../components/Toggle";
import { Card } from "../components/Card";
import { List, ListItem } from "../components/List";
import SubscribeToFeedDialog from "../components/SubscribeToFeedDialog";
import feedsContainer from "../graphql/queries/feeds";

const PageContainer = styled.div`padding: 16px;`;

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

export class FeedsPage extends Component {
  constructor(props) {
    super(props);
    this.state = { showAddFeedDialog: false };
    this._handleDialogClose = this._handleDialogClose.bind(this);
  }

  _toggleAddFeedDialog(opened) {
    this.setState(() => ({ showAddFeedDialog: opened }));
  }

  _handleDialogClose(newFeedCreated) {
    if (newFeedCreated) {
      this.props.data.refetch();
    }

    this._toggleAddFeedDialog(false);
  }

  _handleFeedToggleChange(userFeed, checked) {
    console.log(userFeed.id, checked);
  }

  _renderRow(userFeed) {
    return (
      <FeedItem key={userFeed.id}>
        <FeedInfo>
          {userFeed.name}
          <FeedInfoSubtitle>{userFeed.feed.uri}</FeedInfoSubtitle>
        </FeedInfo>
        <Toggle
          value={userFeed.enabled}
          onChange={checked => this._handleFeedToggleChange(userFeed, checked)}
        />
      </FeedItem>
    );
  }

  render() {
    const { data } = this.props;
    const { showAddFeedDialog } = this.state;
    return (
      <PageContainer>
        <PageTitle value="Feeds" />
        <h1>Feeds</h1>
        <Card>
          <List>
            {data.me && data.me.feeds.map(userFeed => this._renderRow(userFeed))}
          </List>
        </Card>

        <FloatingActionButton primary fixed onClick={() => this._toggleAddFeedDialog(true)}>
          <ContentAdd className="icon" />
        </FloatingActionButton>

        <SubscribeToFeedDialog open={showAddFeedDialog} onRequestClose={this._handleDialogClose} />
      </PageContainer>
    );
  }
}

export default feedsContainer(FeedsPage);
