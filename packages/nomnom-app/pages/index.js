import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { CSSTransitionGroup } from "react-transition-group";
import styled from "styled-components";
import { lighten } from "polished";
import { mapProps, compose } from "recompose";
import queryString from "query-string";
import { withRouter } from "next/router";
import url from "url";
import ContentAdd from "react-icons/lib/md/add";
import VisibilitySensor from "react-visibility-sensor";

import { Card } from "../toolkit/Card";
import { Menu, MenuItem } from "../toolkit/Menu";
import FlatButton from "../toolkit/FlatButton";
import FloatingActionButton from "../toolkit/FloatingActionButton";
import withAuth from "../hoc/withAuth";
import PageWrapper from "../components/PageWrapper";
import PageTitle from "../components/PageTitle";
import { RichListItem, ListItemPlaceholder } from "../components/RichList";
import DelayedComponent from "../components/DelayedComponent";
import AddEntryDialog from "../components/AddEntryDialog";
import EmptyPlaceholder from "../components/EmptyPlaceholder";
import userEntriesContainer from "../graphql/queries/userEntries";
import batchUpdateUserEntriesContainer from "../graphql/mutations/batchUpdateUserEntries";

const DEFAULT_STATUS_FILTER = "NEW";

const TRANSITION_TIME = 450; // how to get this from theme ? (apart from importing it...)
const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 16px;
`;
const MainContainer = styled.main`
  flex: 1;
`;
const FilterContainer = styled.section`
  margin-right: 32px;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const FlexSpacer = styled.div`
  flex: 1;
`;
const MultiSelectBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${props => props.theme.appBarHeight};
  padding: 0 16px;
  z-index: 10001;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${props => lighten(0.45, props.theme.primary1Color)};

  &.animate-enter {
    opacity: 0.01;
  }

  &.animate-enter.animate-enter-active {
    opacity: 1;
    transition: opacity ${props => props.theme.transitionConfig};
  }

  &.animate-leave {
    opacity: 1;
  }

  &.animate-leave.animate-leave-active {
    opacity: 0.01;
    transition: opacity ${props => props.theme.transitionConfig};
  }
`;

const asDisplayedUserEntry = userEntry => ({
  id: userEntry.id,
  title: userEntry.entry.title,
  imageUrl: userEntry.entry.imageUrl || "http://placekitten.com/g/200/200",
  url: userEntry.entry.url,
  domain: url.parse(userEntry.entry.url).hostname,
  status: userEntry.status,
  tags: userEntry.tags
});

const hasItemsSelected = itemMap => Object.values(itemMap).some(selected => selected);

const preventPropagation = e => e.stopPropagation();

export class Entries extends PureComponent {
  state = { showAddEntryDialog: false, selectedRows: {} };

  _handleStatusFilterChange = newStatus => {
    const { query, pushState } = this.props;
    const newQueryParams = Object.assign({}, query, {
      status: newStatus
    });

    pushState(`/?${queryString.stringify(newQueryParams)}`);
  };

  _handleRowClicked = (userEntry, requestingSelection) => {
    const shouldSelect = requestingSelection || hasItemsSelected(this.state.selectedRows);

    if (shouldSelect) {
      const { selectedRows } = this.state;
      const newSelectedRows = Object.assign({}, selectedRows, {
        [userEntry.id]: !selectedRows[userEntry.id]
      });
      this.setState({ selectedRows: newSelectedRows });
    } else {
      this.props.pushState(`/entry?entryId=${userEntry.id}`, `/entries/${userEntry.id}`);
    }
  };

  _handleExitSelectionMode = () => this.setState({ selectedRows: {} });

  _handleAddEntryDialogOpen = () => this.setState({ showAddEntryDialog: true });
  _handleAddEntryDialogClose = () => this.setState({ showAddEntryDialog: false });

  _getActions = userEntries => {
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
  };

  _handleInfiniteScroll = hasReachedEnd => {
    const { hasMore, loading, fetchMore } = this.props;
    const shouldLoadMore = hasReachedEnd && hasMore && !loading;

    if (shouldLoadMore) {
      fetchMore();
    }
  };

  _renderMultiSelecBar = entries => {
    const { selectedRows } = this.state;

    const selectedEntries = entries ? entries.filter(entry => !!selectedRows[entry.id]) : [];
    const shouldShowBar = selectedEntries.length > 0;
    const actions = this._getActions(selectedEntries);

    return (
      <CSSTransitionGroup
        transitionName="animate"
        transitionEnterTimeout={TRANSITION_TIME}
        transitionLeaveTimeout={TRANSITION_TIME}>
        {shouldShowBar ? (
          <MultiSelectBar>
            <FlatButton onClick={this._handleExitSelectionMode}>Cancel</FlatButton>
            <FlexSpacer />
            <span>{selectedEntries.length} selected</span>
            {React.Children.toArray(actions)}
          </MultiSelectBar>
        ) : null}
      </CSSTransitionGroup>
    );
  };

  _renderPlaceholderList = () => {
    return (
      <DelayedComponent delay={100}>
        <List>
          {Array(20)
            .fill()
            .map((_, idx) => (
              <li key={idx}>
                <ListItemPlaceholder />
              </li>
            ))}
        </List>
      </DelayedComponent>
    );
  };

  _renderRow = (userEntry, selectMode) => {
    const tagsCount = userEntry.tags.length;
    const tags = tagsCount > 0 ? ` | ${userEntry.tags.join(", ")}` : "";
    const isSelected = !!this.state.selectedRows[userEntry.id];
    const actions = selectMode
      ? null
      : [
          ...this._getActions([userEntry]),
          <a href={userEntry.url} target="__blank" onClick={preventPropagation}>
            <FlatButton>View original</FlatButton>
          </a>
        ];

    return (
      <li key={userEntry.id}>
        <RichListItem
          imageUrl={userEntry.imageUrl}
          title={userEntry.title}
          subtitle={`${userEntry.domain}${tags}`}
          actions={actions}
          onClick={(ev, requestingSelection) =>
            this._handleRowClicked(userEntry, requestingSelection)
          }
          selected={isSelected}
          selectMode={selectMode}
        />
      </li>
    );
  };

  _renderList = entries => {
    const userEntries = entries.map(asDisplayedUserEntry);
    const selectMode = hasItemsSelected(this.state.selectedRows);

    return userEntries.length ? (
      <List>
        {userEntries.map(userEntry => this._renderRow(userEntry, selectMode))}
        {/*
          Adding a key to the visibility sensor force a rerender when rerendering the list,
          which re-triggers the visilibity check, and thus enables the infinite scroll behavior :)
          */}
        <VisibilitySensor
          key={userEntries.length}
          resizeCheck
          onChange={this._handleInfiniteScroll}
        />
      </List>
    ) : (
      <EmptyPlaceholder />
    );
  };

  render() {
    const { showAddEntryDialog } = this.state;
    const { user, loading, entries, status } = this.props;
    const isFirstLoad = loading && entries.length === 0;

    return (
      <PageWrapper user={user}>
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

          <FloatingActionButton secondary fixed onClick={this._handleAddEntryDialogOpen}>
            <ContentAdd className="icon" />
          </FloatingActionButton>

          <AddEntryDialog
            open={showAddEntryDialog}
            onRequestClose={this._handleAddEntryDialogClose}
          />
        </PageContainer>
      </PageWrapper>
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

  query: PropTypes.object.isRequired,
  pushState: PropTypes.func.isRequired
};

const mappedProps = mapProps(({ loggedInUser: user, router }) => ({
  status: router.query.status || DEFAULT_STATUS_FILTER,
  user,
  query: router.query,
  pushState: router.push
}));

export default compose(
  withRouter,
  withAuth,
  mappedProps,
  batchUpdateUserEntriesContainer,
  userEntriesContainer
)(Entries);
