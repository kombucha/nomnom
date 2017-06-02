import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { lighten } from "polished";
import { mapProps, compose } from "recompose";
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

import userEntriesContainer from "../graphql/queries/userEntries";
import batchUpdateUserEntriesContainer from "../graphql/mutations/batchUpdateUserEntries";

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
  url: userEntry.entry.url,
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
    this._handleListScrolling = this._handleListScrolling.bind(this);
  }

  _handleAddEntryDialogClose(newEntryCreated) {
    // TODO: investigate, weird race condition with refetch which causes the component not to rerender
    // if (newEntryCreated) {
    //   this.props.refetch();
    // }

    this._toggleAddEntryDialog(false);
  }

  _handleStatusFilterChange(newStatus) {
    const { location, history } = this.props;
    const queryParams = queryString.parse(location.search);
    const newQueryParams = Object.assign({}, queryParams, {
      status: newStatus
    });

    history.push({
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

  _handleListScrolling({ overscanStopIndex }) {
    const { entries, hasMore, loading, fetchMore } = this.props;
    const hasReachedEnd = overscanStopIndex === entries.length - 1;
    const shouldLoadMore = hasReachedEnd && hasMore && !loading;

    if (shouldLoadMore) {
      fetchMore();
    }
  }

  _renderMultiSelecBar(entries) {
    const { selectedRows } = this.state;

    const selectedEntries = entries ? entries.filter(entry => !!selectedRows[entry.id]) : [];
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
    const actions = selectMode
      ? null
      : [
          ...this._getActions([userEntry]),
          <a
            href={userEntry.url}
            target="__blank"
            onClick={ev => {
              ev.stopPropagation();
            }}>
            <FlatButton>View original</FlatButton>
          </a>
        ];

    return (
      <div key={key} style={style}>
        {isScrolling
          ? <ListItemPlaceholder />
          : <RichListItem
              imageUrl={userEntry.imageUrl}
              title={userEntry.title}
              subtitle={`${userEntry.domain}${tags}`}
              actions={actions}
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
        {({ height, isScrolling, scrollTop }) =>
          <AutoSizer disableHeight>
            {({ width }) =>
              <StyledVirtualizedList
                height={height}
                width={width}
                autoHeight
                isScrolling={isScrolling}
                scrollTop={scrollTop}
                rowCount={userEntries.length}
                rowHeight={LIST_ITEM_HEIGHT}
                noRowsRenderer={noContent}
                onRowsRendered={this._handleListScrolling}
                rowRenderer={params =>
                  this._renderRow(userEntries[params.index], selectMode, params)}
              />}
          </AutoSizer>}
      </WindowScroller>
    );
  }

  render() {
    const { showAddEntryDialog } = this.state;
    const { loading, entries, status } = this.props;
    const isFirstLoad = loading && entries.length === 0;

    return (
      <PageContainer>
        <PageTitle value="Home" />

        {this._renderMultiSelecBar(entries)}

        <FilterContainer>
          <Menu value={status} onChange={this._handleStatusFilterChange}>
            <MenuItem value="NEW">New</MenuItem>
            <MenuItem value="LATER">Later</MenuItem>
            <MenuItem value="FAVORITE">Favorites</MenuItem>
            <MenuItem value="ARCHIVED">Archived</MenuItem>
          </Menu>
        </FilterContainer>

        <MainContainer>
          <Card fullBleed>
            {isFirstLoad ? this._renderPlaceholderList() : this._renderList(entries)}
          </Card>
        </MainContainer>

        <FloatingActionButton secondary fixed onClick={() => this._toggleAddEntryDialog(true)}>
          <ContentAdd className="icon" />
        </FloatingActionButton>

        <AddEntryDialog
          open={showAddEntryDialog}
          onRequestClose={this._handleAddEntryDialogClose}
        />
      </PageContainer>
    );
  }
}

Entries.propTypes = {
  status: PropTypes.string.isRequired, // TODO: enum
  entries: PropTypes.array.isRequired,
  hasMore: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,

  refetch: PropTypes.func.isRequired,
  fetchMore: PropTypes.func.isRequired,
  batchUpdateUserEntries: PropTypes.func.isRequired,

  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const statusPropContainer = mapProps(({ location, history }) => ({
  status: statusFromLocation(location) || DEFAULT_STATUS_FILTER,
  location,
  history
}));

export default compose(statusPropContainer, batchUpdateUserEntriesContainer, userEntriesContainer)(
  Entries
);
