import React, { Component } from "react";
import { Link } from "react-router-dom";
import FloatingActionButton from "material-ui/FloatingActionButton";
import { List, ListItem } from "material-ui/List";
import Avatar from "material-ui/Avatar";
import ContentAdd from "material-ui/svg-icons/content/add";

import { gql, graphql } from "react-apollo";

import AddEntryDialog from "../components/AddEntryDialog";

const STYLES = {
  link: {
    textDecoration: "none",
    color: "inherit"
  },
  fab: {
    position: "fixed",
    bottom: 16,
    right: 16,
    zIndex: 100
  }
};

const asDisplayedUserEntry = userEntry => ({
  id: userEntry.id,
  title: userEntry.entry.title,
  imageUrl: userEntry.entry.imageUrl || "http://placekitten.com/g/200/200",
  domain: new URL(userEntry.entry.url).hostname,
  tags: userEntry.tags
});

class Entries extends Component {
  constructor() {
    super();
    this.state = { showAddEntryDialog: false };
    this.handleAddEntryDialogClose = this.handleAddEntryDialogClose.bind(this);
  }

  renderList() {
    const userEntries = this.props.data.me.entries.map(asDisplayedUserEntry);
    return (
      <List>
        {userEntries.map(userEntry => (
          <Link
            key={userEntry.id}
            to={`/entries/${userEntry.id}`}
            style={STYLES.link}>
            <ListItem
              leftAvatar={<Avatar src={userEntry.imageUrl} />}
              primaryText={userEntry.title}
              secondaryText={userEntry.domain}
            />
          </Link>
        ))}
      </List>
    );
  }

  toggleAddEntryDialog(opened) {
    this.setState({ showAddEntryDialog: opened });
  }

  renderLoading() {
    return <div>Loading...</div>;
  }

  handleAddEntryDialogClose(newEntryCreated) {
    // TODO: investigate, weird race condition with refetch which causes the component not to rerender
    if (newEntryCreated) {
      this.props.data.refetch();
    }

    this.toggleAddEntryDialog(false);
  }

  render() {
    const { data } = this.props;
    const { showAddEntryDialog } = this.state;

    return (
      <div className="Entries">
        <div className="content">
          {data.loading ? this.renderLoading() : this.renderList()}
        </div>
        <AddEntryDialog
          open={showAddEntryDialog}
          onRequestClose={this.handleAddEntryDialogClose}
        />
        <FloatingActionButton
          secondary
          style={STYLES.fab}
          onClick={() => this.toggleAddEntryDialog(true)}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

const query = gql`{me {entries {id tags entry {title imageUrl url}}}}`;
const EntriesWithData = graphql(query)(Entries);
export default EntriesWithData;
