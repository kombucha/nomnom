import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import ContentAdd from "react-icons/lib/md/add";

import PageTitle from "../components/PageTitle";
import FloatingActionButton from "../components/FloatingActionButton";
import { Card } from "../components/Card";
import { List, ListItem } from "../components/List";
import SubscribeToFeedDialog from "../components/SubscribeToFeedDialog";

export class Feeds extends Component {
  constructor() {
    super();
    this.state = { showAddFeedDialog: false };

    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  toggleAddFeedDialog(opened) {
    this.setState(() => ({ showAddFeedDialog: opened }));
  }

  handleDialogClose(newFeedCreated) {
    if (newFeedCreated) {
      this.props.data.refetch();
    }

    this.toggleAddFeedDialog(false);
  }

  render() {
    const { data } = this.props;
    const { showAddFeedDialog } = this.state;
    return (
      <div>
        <PageTitle value="Feeds" />
        <Card>
          <List>
            {data.me &&
              data.me.feeds.map(feed => (
                <ListItem key={feed.id}>{feed.name}</ListItem>
              ))}
          </List>
        </Card>

        <FloatingActionButton
          primary
          fixed
          onClick={() => this.toggleAddFeedDialog(true)}
        >
          <ContentAdd className="icon" />
        </FloatingActionButton>

        <SubscribeToFeedDialog
          open={showAddFeedDialog}
          onRequestClose={this.handleDialogClose}
        />
      </div>
    );
  }
}

const query = gql`query {
  me {
    feeds {id name enabled}
  }
}`;

const FeedsWithData = graphql(query)(Feeds);

export default FeedsWithData;
