import React, { Component } from "react";

import { Link } from "react-router-dom";

import FloatingActionButton from "material-ui/FloatingActionButton";
import { List, ListItem } from "material-ui/List";
import Avatar from "material-ui/Avatar";
import { Card, CardText } from "material-ui/Card";
import Paper from "material-ui/Paper";
import { Menu, MenuItem } from "material-ui/Menu";
import ContentAdd from "material-ui/svg-icons/content/add";

import { gql, graphql } from "react-apollo";
import queryString from "query-string";

import AddEntryDialog from "../components/AddEntryDialog";
import "./Entries.css";

const DEFAULT_STATUS_FILTER = "NEW";

const STYLES = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: 16
  },
  content: {
    flex: 1
  },
  filters: {
    marginRight: 32
  },
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

const statusFromLocation = location => queryString.parse(location.search).status;

export class Entries extends Component {
  constructor() {
    super();
    this.state = { showAddEntryDialog: false };
    this.handleAddEntryDialogClose = this.handleAddEntryDialogClose.bind(this);
    this.handleStatusFilterChange = this.handleStatusFilterChange.bind(this);
  }

  handleAddEntryDialogClose(newEntryCreated) {
    // TODO: investigate, weird race condition with refetch which causes the component not to rerender
    if (newEntryCreated) {
      this.props.data.refetch();
    }

    this.toggleAddEntryDialog(false);
  }

  toggleAddEntryDialog(opened) {
    this.setState({ showAddEntryDialog: opened });
  }

  handleStatusFilterChange(_, newStatus) {
    const queryParams = queryString.parse(this.props.location.search);
    const newQueryParams = Object.assign({}, queryParams, {
      status: newStatus
    });

    this.props.history.push({
      search: "?" + queryString.stringify(newQueryParams)
    });
  }

  _renderPlaceholderList() {
    return (
      <List>
        {Array(10)
          .fill()
          .map((_, idx) => (
            <ListItem
              key={idx}
              disabled
              leftAvatar={<div className="placeholder-item placeholder-item--avatar" />}
              primaryText={<div className="placeholder-item" />}
              secondaryText={<div className="placeholder-item placeholder-item--half" />}
            />
          ))}

      </List>
    );
  }

  _renderSecondaryText(userEntry) {
    const tagsCount = userEntry.tags.length;
    const tags = tagsCount > 0
      ? <span>
          {" | "}
          {userEntry.tags.map((tag, idx) => (
            <span key={tag}>{`${tag}${idx < tagsCount - 1 ? ", " : ""}`}</span>
          ))}
        </span>
      : null;
    return <span>{userEntry.domain}{tags}</span>;
  }

  _renderList() {
    const userEntries = this.props.data.me.entries.map(asDisplayedUserEntry);

    return (
      <List>
        {userEntries.map(userEntry => (
          <Link key={userEntry.id} to={`/entries/${userEntry.id}`} style={STYLES.link}>
            <ListItem
              leftAvatar={<Avatar src={userEntry.imageUrl} />}
              primaryText={userEntry.title}
              secondaryText={this._renderSecondaryText(userEntry)}
            />
          </Link>
        ))}
      </List>
    );
  }

  _renderFilters() {
    const statusFilter = statusFromLocation(this.props.location) || DEFAULT_STATUS_FILTER;

    return (
      <Paper style={STYLES.filters}>
        <Menu value={statusFilter} onChange={this.handleStatusFilterChange}>
          <MenuItem value="NEW">New</MenuItem>
          <MenuItem value="LATER">Later</MenuItem>
          <MenuItem value="FAVORITE">Favorites</MenuItem>
          <MenuItem value="ARCHIVED">Archived</MenuItem>
        </Menu>
      </Paper>
    );
  }

  _renderContent() {
    const { data } = this.props;
    return (
      <Card style={STYLES.content}>
        <CardText>
          {data.loading ? this._renderPlaceholderList() : this._renderList()}
        </CardText>
      </Card>
    );
  }

  render() {
    const { showAddEntryDialog } = this.state;

    return (
      <div style={STYLES.container}>
        {this._renderFilters()}
        {this._renderContent()}
        <AddEntryDialog open={showAddEntryDialog} onRequestClose={this.handleAddEntryDialogClose} />
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

const query = gql`query($status: UserEntryStatus) {
  me {
    entries(status: $status) {id tags entry {title imageUrl url}}
  }
}`;

const EntriesWithData = graphql(query, {
  options: props => ({
    variables: {
      status: statusFromLocation(props.location) || DEFAULT_STATUS_FILTER
    }
  })
})(Entries);

export default EntriesWithData;
