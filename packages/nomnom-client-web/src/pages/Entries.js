import React, { Component } from "react";
import { gql, graphql, compose } from "react-apollo";
import styled from "styled-components";
import { lighten } from "polished";
import queryString from "query-string";
import ContentAdd from "react-icons/lib/md/add";
import VirtualizedList from "react-virtualized/dist/commonjs/List";
import WindowScroller from "react-virtualized/dist/commonjs/WindowScroller";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";

import PageTitle from "../components/PageTitle";
import DelayedComponent from "../components/DelayedComponent";
import { LIST_ITEM_HEIGHT, RichListItem, ListItemPlaceholder } from "../components/RichList";
import EmptyPlaceholder from "../components/EmptyPlaceholder";
import { Card } from "../components/Card";
import { Menu, MenuItem } from "../components/Menu";
import FlatButton from "../components/FlatButton";
import FloatingActionButton from "../components/FloatingActionButton";
import AddEntryDialog from "../components/AddEntryDialog";

const DEFAULT_STATUS_FILTER = "NEW";

const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 16px;
`;
const MainContainer = styled.main`flex: 1;`;
const FilterContainer = styled.section`margin-right: 32px;`;

const StyledVirtualizedList = styled(VirtualizedList)`outline: 0`;

const FlexSpacer = styled.div`flex: 1;`;
const MultiSelectBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  padding: 0 16px;
  z-index: 10001;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${props => lighten(0.45, props.theme.primary1Color)}
`;

const asDisplayedUserEntry = userEntry => ({
  id: userEntry.id,
  title: userEntry.entry.title,
  imageUrl: userEntry.entry.imageUrl || "http://placekitten.com/g/200/200",
  domain: new URL(userEntry.entry.url).hostname,
  status: userEntry.status,
  tags: userEntry.tags
});

const statusFromLocation = location => queryString.parse(location.search).status;

const noContent = () => <EmptyPlaceholder />;

const hasItemsSelected = itemMap => Object.values(itemMap).some(selected => selected);

export class Entries extends Component {
  constructor() {
    super();
    this.state = { showAddEntryDialog: false, selectedRows: {} };
    this._handleAddEntryDialogClose = this._handleAddEntryDialogClose.bind(this);
    this._handleStatusFilterChange = this._handleStatusFilterChange.bind(this);
    this._handleExitSelectionMode = this._handleExitSelectionMode.bind(this);
    this._handleRowClicked = this._handleRowClicked.bind(this);
  }

  _handleAddEntryDialogClose(newEntryCreated) {
    // TODO: investigate, weird race condition with refetch which causes the component not to rerender
    if (newEntryCreated) {
      this.props.data.refetch();
    }

    this._toggleAddEntryDialog(false);
  }

  _handleStatusFilterChange(newStatus) {
    const queryParams = queryString.parse(this.props.location.search);
    const newQueryParams = Object.assign({}, queryParams, {
      status: newStatus
    });

    this.props.history.push({
      search: "?" + queryString.stringify(newQueryParams)
    });
  }

  _handleRowClicked(userEntry, requestingSelection) {
    const shouldSelect = requestingSelection || hasItemsSelected(this.state.selectedRows);

    if (shouldSelect) {
      const { selectedRows } = this.state;
      const newSelectedRows = Object.assign({}, selectedRows, {
        [userEntry.id]: !selectedRows[userEntry.id]
      });
      this.setState({ selectedRows: newSelectedRows });
    } else {
      this.props.history.push(`/entries/${userEntry.id}`);
    }
  }

  _handleExitSelectionMode() {
    this.setState({ selectedRows: {} });
  }

  _toggleAddEntryDialog(opened) {
    this.setState({ showAddEntryDialog: opened });
  }

  _getActions(userEntries) {
    const isSingleMode =
      userEntries.length === 1 ||
      userEntries.every(entry => entry.status === userEntries[0].status);
    const statuses = ["LATER", "ARCHIVED", "FAVORITE"].filter(
      status => !isSingleMode || (userEntries[0] && userEntries[0].status !== status)
    );
    const onClick = status => ev => {
      ev.preventDefault();
      ev.stopPropagation();

      const ids = userEntries.map(e => e.id);
      this.props
        .batchUpdateUserEntries({ ids, status })
        .then(() => this._handleExitSelectionMode());
    };
    return statuses.map(status => <FlatButton onClick={onClick(status)}>{status}</FlatButton>);
  }

  _renderMultiSelecBar() {
    const { selectedRows } = this.state;
    const { data } = this.props;
    const selectedEntries = data.me
      ? data.me.entries.filter(entry => !!selectedRows[entry.id])
      : [];
    const actions = this._getActions(selectedEntries);

    return selectedEntries.length > 0
      ? <MultiSelectBar>
          <FlatButton onClick={this._handleExitSelectionMode}>
            Cancel
          </FlatButton>
          <FlexSpacer />
          <span>{selectedEntries.length} selected</span>
          {React.Children.toArray(actions)}
        </MultiSelectBar>
      : null;
  }

  _renderPlaceholderList() {
    return (
      <DelayedComponent delay={100}>
        <div>
          {Array(20).fill().map((_, idx) => <ListItemPlaceholder key={idx} />)}
        </div>
      </DelayedComponent>
    );
  }

  _renderRow(userEntry, selectMode, { key, style, index, isScrolling }) {
    const tagsCount = userEntry.tags.length;
    const tags = tagsCount > 0 ? ` | ${userEntry.tags.join(", ")}` : "";
    const isSelected = !!this.state.selectedRows[userEntry.id];

    return (
      <div key={key} style={style}>
        {isScrolling
          ? <ListItemPlaceholder />
          : <RichListItem
              imageUrl={userEntry.imageUrl}
              title={userEntry.title}
              subtitle={`${userEntry.domain}${tags}`}
              actions={selectMode ? null : this._getActions([userEntry])}
              onClick={(ev, requestingSelection) =>
                this._handleRowClicked(userEntry, requestingSelection)}
              selected={isSelected}
              selectMode={selectMode}
            />}
      </div>
    );
  }

  _renderList(entries) {
    const userEntries = entries.map(asDisplayedUserEntry);
    const selectMode = hasItemsSelected(this.state.selectedRows);

    return (
      <WindowScroller>
        {({ height, isScrolling, scrollTop }) => (
          <AutoSizer disableHeight>
            {({ width }) => (
              <StyledVirtualizedList
                height={height}
                width={width}
                autoHeight
                isScrolling={isScrolling}
                scrollTop={scrollTop}
                rowCount={userEntries.length}
                rowHeight={LIST_ITEM_HEIGHT}
                noRowsRenderer={noContent}
                rowRenderer={params =>
                  this._renderRow(userEntries[params.index], selectMode, params)}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    );
  }

  _renderFilters() {
    const statusFilter = statusFromLocation(this.props.location) || DEFAULT_STATUS_FILTER;

    return (
      <FilterContainer>
        <Menu value={statusFilter} onChange={this._handleStatusFilterChange}>
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
        <Card fullBleed>
          {data.loading ? this._renderPlaceholderList() : this._renderList(data.me.entries)}
        </Card>
      </MainContainer>
    );
  }

  render() {
    const { showAddEntryDialog } = this.state;

    return (
      <PageContainer>
        <PageTitle value="Home" />

        {this._renderMultiSelecBar()}
        {this._renderFilters()}
        {this._renderContent()}

        <AddEntryDialog
          open={showAddEntryDialog}
          onRequestClose={this._handleAddEntryDialogClose}
        />

        <FloatingActionButton secondary fixed onClick={() => this._toggleAddEntryDialog(true)}>
          <ContentAdd className="icon" />
        </FloatingActionButton>
      </PageContainer>
    );
  }
}

const query = gql`query($status: UserEntryStatus) {
  me {
    entries(status: $status) {id status tags entry {title imageUrl url}}
  }
}`;
const mutation = gql`mutation batchUpdateUserEntries($batchUpdateUserEntriesInput: BatchUpdateUserEntriesInput!) {
  batchUpdateUserEntries(batchUpdateUserEntriesInput: $batchUpdateUserEntriesInput) {id status lastUpdateDate}
}`;

const withQuery = graphql(query, {
  options: props => ({
    variables: {
      status: statusFromLocation(props.location) || DEFAULT_STATUS_FILTER
    }
  })
});

const withMutation = graphql(mutation, {
  props: ({ mutate }) => ({
    batchUpdateUserEntries: batchUpdateUserEntriesInput =>
      mutate({ variables: { batchUpdateUserEntriesInput } })
  })
});

export default compose(withMutation, withQuery)(Entries);
