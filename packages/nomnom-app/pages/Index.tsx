import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import styled from "@emotion/styled";
import { lighten } from "polished";
import queryString from "query-string";
import url from "url";
import ContentAdd from "react-icons/lib/md/add";
import VisibilitySensor from "react-visibility-sensor";
import { useRouter } from "next/router";

import { Card } from "../toolkit/Card";
import FlatButton from "../toolkit/FlatButton";
import FloatingActionButton from "../toolkit/FloatingActionButton";
import withAuth from "../components/hoc/withAuth";
import PageWrapper from "../components/PageWrapper";
import PageTitle from "../components/PageTitle";
import { RichListItem, ListItemPlaceholder } from "../components/RichList";
import DelayedComponent from "../components/DelayedComponent";
import AddEntryDialog from "../components/AddEntryDialog";
import EmptyPlaceholder from "../components/EmptyPlaceholder";
import UserEntryStatusFilter from "../components/UserEntryStatusFilter";
import useUserEntries, { UserEntry } from "../graphql/queries/userEntries";
import useBatchUpdateUserEntries from "../graphql/mutations/batchUpdateUserEntries";
import { ThemeType } from "../toolkit/theme";
import { UserEntryStatus } from "../apollo-types";

type SelectedRows = Record<string, boolean>;

const DEFAULT_STATUS_FILTER = "NEW";

const TRANSITION_TIME = 450; // how to get this from theme ? (apart from importing it...)
const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const MainContainer = styled.main`
  flex: 1;
`;
const FilterContainer = styled.section`
  margin-right: 32px;

  @media (max-width: 768px) {
    margin: 0 0 16px 0;
  }
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const FlexSpacer = styled.div`
  flex: 1;
`;
const MultiSelectBarContainer = styled.div<{}, ThemeType>`
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

  &.animate-exit {
    opacity: 1;
  }

  &.animate-exit.animate-exit-active {
    opacity: 0.01;
    transition: opacity ${props => props.theme.transitionConfig};
  }
`;

const asDisplayedUserEntry = userEntry => ({
  id: userEntry.id,
  title: userEntry.entry.title,
  imageUrl: userEntry.entry.imageUrl
    ? `${userEntry.entry.imageUrl}?w=100&h=100`
    : "http://placekitten.com/g/100/100",
  url: userEntry.entry.url,
  domain: url.parse(userEntry.entry.url).hostname,
  status: userEntry.status,
  tags: userEntry.tags
});

const hasItemsSelected = itemMap => Object.values(itemMap).some(selected => selected);

const preventPropagation = e => e.stopPropagation();

const Placeholder = () => (
  <DelayedComponent delay={100}>
    <List>
      {Array(20)
        .fill(undefined)
        .map((_, idx) => (
          <li key={idx}>
            <ListItemPlaceholder />
          </li>
        ))}
    </List>
  </DelayedComponent>
);

type EntriesActionsProps = {
  userEntries: Pick<UserEntry, "id" | "status">[];
  onExitSelectionMode: Function;
};

const EntriesActions = ({ userEntries, onExitSelectionMode }: EntriesActionsProps) => {
  const isSingleMode =
    userEntries.length === 1 || userEntries.every(entry => entry.status === userEntries[0].status);
  const statuses = [
    UserEntryStatus.LATER,
    UserEntryStatus.ARCHIVED,
    UserEntryStatus.FAVORITE
  ].filter(status => !isSingleMode || (userEntries[0] && userEntries[0].status !== status));

  const [batchUpdateUserEntries] = useBatchUpdateUserEntries();

  const handleClick = (status: UserEntryStatus) => async (ev: React.MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    try {
      const ids = userEntries.map<string>(e => e.id);
      await batchUpdateUserEntries({ variables: { batchUpdateUserEntriesInput: { ids, status } } });
    } finally {
      onExitSelectionMode();
    }
  };

  return (
    <>
      {statuses.map(status => (
        <FlatButton onClick={handleClick(status)}>{status}</FlatButton>
      ))}
    </>
  );
};

type MultiSelectBarProps = {
  entries: any;
  selectedRows: SelectedRows;
  onExitSelectionMode: Function;
};

const MultiSelectBar = ({ entries, selectedRows, onExitSelectionMode }: MultiSelectBarProps) => {
  const selectedEntries = entries ? entries.filter(entry => !!selectedRows[entry.id]) : [];
  const shouldShowBar = selectedEntries.length > 0;

  return (
    <CSSTransition classNames="animate" in={shouldShowBar} timeout={TRANSITION_TIME} unmountOnExit>
      <MultiSelectBarContainer>
        <FlatButton onClick={onExitSelectionMode}>Cancel</FlatButton>
        <FlexSpacer />
        <span>{selectedEntries.length} selected</span>
        <EntriesActions userEntries={selectedEntries} onExitSelectionMode={onExitSelectionMode} />
      </MultiSelectBarContainer>
    </CSSTransition>
  );
};

type EntriesListProps = {
  userEntries: UserEntry[];
  loading: boolean;
  hasMore: boolean;
  fetchMore: Function;
  selectedRows: SelectedRows;
  onRowSelected: (userEntryId: string) => void;
  onExitSelectionMode: Function;
};

const EntriesList = ({
  userEntries,
  loading,
  hasMore,
  fetchMore,
  selectedRows,
  onRowSelected,
  onExitSelectionMode
}: EntriesListProps) => {
  const router = useRouter();
  const displayedUserEntries = userEntries.map(asDisplayedUserEntry);
  const selectMode = hasItemsSelected(selectedRows);

  const handleInfiniteScroll = (hasReachedEnd: boolean) => {
    const shouldLoadMore = hasReachedEnd && hasMore && !loading;

    if (shouldLoadMore) {
      fetchMore();
    }
  };

  const handleRowClicked = (userEntry, requestingSelection: boolean) => {
    const shouldSelect = requestingSelection || selectMode;

    if (shouldSelect) {
      onRowSelected(userEntry.id);
    } else {
      router.push(`/entry?entryId=${userEntry.id}`, `/entries/${userEntry.id}`);
    }
  };

  return (
    <>
      {displayedUserEntries.length ? (
        <List>
          {displayedUserEntries.map(userEntry => {
            const tagsCount = userEntry.tags.length;
            const tags = tagsCount > 0 ? ` | ${userEntry.tags.join(", ")}` : "";
            const isSelected = Boolean(selectedRows[userEntry.id]);

            return (
              <li key={userEntry.id}>
                <RichListItem
                  imageUrl={userEntry.imageUrl}
                  title={userEntry.title}
                  subtitle={`${userEntry.domain}${tags}`}
                  actions={
                    <>
                      <EntriesActions
                        userEntries={[userEntry]}
                        onExitSelectionMode={onExitSelectionMode}
                      />
                      <a href={userEntry.url} target="__blank" onClick={preventPropagation}>
                        <FlatButton>View original</FlatButton>
                      </a>
                    </>
                  }
                  onClick={(_, requestingSelection) =>
                    handleRowClicked(userEntry, requestingSelection)
                  }
                  selected={isSelected}
                  selectMode={selectMode}
                />
              </li>
            );
          })}
        </List>
      ) : (
        <EmptyPlaceholder />
      )}
      {/*
          Adding a key to the visibility sensor force a rerender when rerendering the list,
          which re-triggers the visilibity check, and thus enables the infinite scroll behavior :)
          */}
      <VisibilitySensor
        key={`vis-${displayedUserEntries.length}`}
        resizeCheck
        onChange={handleInfiniteScroll}
      />
    </>
  );
};

const Index = ({ loggedInUser }: any) => {
  const router = useRouter();
  const { loading, hasMore, fetchMore, entries } = useUserEntries();
  const [showAddEntryDialog, setShowAddEntryDialog] = useState(false);
  const [selectedRows, setSelectedRows] = useState<SelectedRows>({});

  const status = (router.query.status || DEFAULT_STATUS_FILTER) as UserEntryStatus;
  const isFirstLoad = loading && entries.length === 0;

  const handleExitSelectionMode = () => setSelectedRows({});
  const handleRowSelected = (userEntryId: string) => {
    setSelectedRows({ ...selectedRows, [userEntryId]: !selectedRows[userEntryId] });
  };

  const handleToggleAddEntryDialog = () => setShowAddEntryDialog(show => !show);
  const handleStatusFilterChange = (newStatus: UserEntryStatus) => {
    const newQueryParams = { ...router.query, status: newStatus };
    router.push(`/?${queryString.stringify(newQueryParams)}`);
  };

  return (
    <PageWrapper user={loggedInUser}>
      <PageContainer>
        <PageTitle value="Home" />

        <MultiSelectBar
          entries={entries}
          selectedRows={selectedRows}
          onExitSelectionMode={handleExitSelectionMode}
        />

        <FilterContainer>
          <UserEntryStatusFilter status={status} onStatusChange={handleStatusFilterChange} />
        </FilterContainer>

        <MainContainer>
          <Card fullBleed>
            {isFirstLoad ? (
              <Placeholder />
            ) : (
              <EntriesList
                userEntries={entries}
                loading={loading}
                hasMore={hasMore}
                fetchMore={fetchMore}
                selectedRows={selectedRows}
                onRowSelected={handleRowSelected}
                onExitSelectionMode={handleExitSelectionMode}
              />
            )}
          </Card>
        </MainContainer>

        <FloatingActionButton secondary fixed onClick={handleToggleAddEntryDialog}>
          <ContentAdd className="icon" />
        </FloatingActionButton>

        <AddEntryDialog open={showAddEntryDialog} onRequestClose={handleToggleAddEntryDialog} />
      </PageContainer>
    </PageWrapper>
  );
};

export default withAuth(Index);
