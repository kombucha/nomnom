import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import styled from "styled-components";
import queryString from "query-string";
import ContentAdd from "react-icons/lib/md/add";

import PageTitle from "../components/PageTitle";
import DelayedComponent from "../components/DelayedComponent";
import { Menu, MenuItem } from "../components/Menu";
import { AutoSizer, List as VirtualizedList } from "react-virtualized";
import AddEntryDialog from "../components/AddEntryDialog";
import { List, ListItem } from "../components/List";
import FloatingActionButton from "../components/FloatingActionButton";
import {
  UserEntryItem,
  UserEntryItemPlaceholder,
  USER_ENTRY_ITEM_HEIGHT
} from "../components/UserEntryItem";

const DEFAULT_STATUS_FILTER = "NEW";

const PageContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 16px;
`;
const MainContainer = styled.main`flex: 1; height: 100%;`;
const FilterContainer = styled.section`margin-right: 32px;`;

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
      <DelayedComponent delay={100}>
        <List>
          {Array(20).fill().map((_, idx) => (
            <ListItem key={idx}>
              <UserEntryItemPlaceholder />
            </ListItem>
          ))}

        </List>
      </DelayedComponent>
    );
  }

  _renderList() {
    const userEntries = this.props.data.me.entries.map(asDisplayedUserEntry);

    return (
      <AutoSizer>
        {({ height, width }) => (
          <VirtualizedList
            width={width}
            height={height}
            rowCount={userEntries.length}
            rowHeight={USER_ENTRY_ITEM_HEIGHT}
            rowRenderer={({ key, style, index, isScrolling }) => (
              <div key={key} style={style}>
                {isScrolling
                  ? <UserEntryItemPlaceholder />
                  : <UserEntryItem userEntry={userEntries[index]} />}
              </div>
            )}
          />
        )}
      </AutoSizer>
    );
  }

  _renderFilters() {
    const statusFilter = statusFromLocation(this.props.location) || DEFAULT_STATUS_FILTER;

    return (
      <FilterContainer>
        <Menu value={statusFilter} onChange={this.handleStatusFilterChange}>
          <MenuItem value="NEW">New</MenuItem>
          <MenuItem value="LATER">Later</MenuItem>
          <MenuItem value="FAVORITE">Favorites</MenuItem>
          <MenuItem value="ARCHIVED">Archived</MenuItem>
        </Menu>
      </FilterContainer>
    );
  }

  _renderContent() {
    const { data } = this.props;
    return (
      <MainContainer>
        {data.loading ? this._renderPlaceholderList() : this._renderList()}
      </MainContainer>
    );
  }

  render() {
    const { showAddEntryDialog } = this.state;

    return (
      <PageContainer>
        <PageTitle value="Home" />
        {this._renderFilters()}
        {this._renderContent()}
        <AddEntryDialog open={showAddEntryDialog} onRequestClose={this.handleAddEntryDialogClose} />

        <FloatingActionButton secondary fixed onClick={() => this.toggleAddEntryDialog(true)}>
          <ContentAdd className="icon" />
        </FloatingActionButton>
      </PageContainer>
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
