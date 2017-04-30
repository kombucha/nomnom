import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import queryString from "query-string";
import ContentAdd from "material-ui/svg-icons/content/add";

import { Menu, MenuItem } from "../components/Menu";
import { List, ListItem } from "../components/List";
import Card from "../components/Card";
import AddEntryDialog from "../components/AddEntryDialog";
import FloatingActionButton from "../components/FloatingActionButton";
import { UserEntryItem, UserEntryItemPlaceholder } from "../components/UserEntryItem";

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

  handleStatusFilterChange(newStatus) {
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
        {Array(10).fill().map((_, idx) => (
          <ListItem key={idx}>
            <UserEntryItemPlaceholder />
          </ListItem>
        ))}

      </List>
    );
  }

  _renderList() {
    const userEntries = this.props.data.me.entries.map(asDisplayedUserEntry);

    return (
      <List>
        {userEntries.map(userEntry => (
          <ListItem key={userEntry.id}>
            <UserEntryItem userEntry={userEntry} />
          </ListItem>
        ))}
      </List>
    );
  }

  _renderFilters() {
    const statusFilter = statusFromLocation(this.props.location) || DEFAULT_STATUS_FILTER;

    return (
      <Menu style={STYLES.filters} value={statusFilter} onChange={this.handleStatusFilterChange}>
        <MenuItem value="NEW">New</MenuItem>
        <MenuItem value="LATER">Later</MenuItem>
        <MenuItem value="FAVORITE">Favorites</MenuItem>
        <MenuItem value="ARCHIVED">Archived</MenuItem>
      </Menu>
    );
  }

  _renderContent() {
    const { data } = this.props;
    return (
      <Card fullBleed style={STYLES.content}>
        {data.loading ? this._renderPlaceholderList() : this._renderList()}
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

        <FloatingActionButton secondary fixed onClick={() => this.toggleAddEntryDialog(true)}>
          <ContentAdd style={{ color: "inherit" }} />
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
