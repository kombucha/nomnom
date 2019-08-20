

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserEntryTags
// ====================================================

export interface UserEntryTags_userEntry {
  __typename: "UserEntry";
  id: string;
  tags: string[];
}

export interface UserEntryTags {
  userEntry: UserEntryTags_userEntry;
}

export interface UserEntryTagsVariables {
  userEntryId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BookmarkletTokenQuery
// ====================================================

export interface BookmarkletTokenQuery {
  bookmarkletToken: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addUserEntry
// ====================================================

export interface addUserEntry_addUserEntry_entry {
  __typename: "Entry";
  title: string;
  imageUrl: string | null;
  url: string;
}

export interface addUserEntry_addUserEntry {
  __typename: "UserEntry";
  id: string;
  status: UserEntryStatus;
  tags: string[];
  entry: addUserEntry_addUserEntry_entry;
}

export interface addUserEntry {
  addUserEntry: addUserEntry_addUserEntry;
}

export interface addUserEntryVariables {
  addUserEntryInput: AddUserEntryInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: batchAddUserEntries
// ====================================================

export interface batchAddUserEntries_batchAddUserEntries {
  __typename: "UserEntry";
  id: string;
}

export interface batchAddUserEntries {
  batchAddUserEntries: (batchAddUserEntries_batchAddUserEntries | null)[];
}

export interface batchAddUserEntriesVariables {
  batchAddUserEntriesInput: AddUserEntryInput[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: batchSubscribeToFeeds
// ====================================================

export interface batchSubscribeToFeeds_batchSubscribeToFeeds {
  __typename: "UserFeed";
  id: string;
}

export interface batchSubscribeToFeeds {
  batchSubscribeToFeeds: (batchSubscribeToFeeds_batchSubscribeToFeeds | null)[];
}

export interface batchSubscribeToFeedsVariables {
  batchSubscribeToFeedsInput: SubscribeToFeedInput[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: BatchUpdateUserEntriesMutation
// ====================================================

export interface BatchUpdateUserEntriesMutation_batchUpdateUserEntries_entry {
  __typename: "Entry";
  title: string;
  imageUrl: string | null;
  url: string;
}

export interface BatchUpdateUserEntriesMutation_batchUpdateUserEntries {
  __typename: "UserEntry";
  id: string;
  status: UserEntryStatus;
  tags: string[];
  entry: BatchUpdateUserEntriesMutation_batchUpdateUserEntries_entry;
}

export interface BatchUpdateUserEntriesMutation {
  batchUpdateUserEntries: (BatchUpdateUserEntriesMutation_batchUpdateUserEntries | null)[];
}

export interface BatchUpdateUserEntriesMutationVariables {
  batchUpdateUserEntriesInput: BatchUpdateUserEntriesInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deleteAllMyData
// ====================================================

export interface deleteAllMyData {
  deleteAllMyData: boolean;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: subscribeToFeed
// ====================================================

export interface subscribeToFeed_subscribeToFeed {
  __typename: "UserFeed";
  id: string;
}

export interface subscribeToFeed {
  subscribeToFeed: subscribeToFeed_subscribeToFeed;
}

export interface subscribeToFeedVariables {
  subscribeToFeedInput: SubscribeToFeedInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ToggleUserFeedMutation
// ====================================================

export interface ToggleUserFeedMutation_updateUserFeed {
  __typename: "UserFeed";
  id: string;
  enabled: boolean;
}

export interface ToggleUserFeedMutation {
  updateUserFeed: ToggleUserFeedMutation_updateUserFeed;
}

export interface ToggleUserFeedMutationVariables {
  userFeedUpdateInput: UserFeedUpdateInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateUserEntry
// ====================================================

export interface updateUserEntry_updateUserEntry {
  __typename: "UserEntry";
  id: string;
  progress: number | null;
  status: UserEntryStatus;
  tags: string[];
  lastUpdateDate: any | null;
}

export interface updateUserEntry {
  updateUserEntry: updateUserEntry_updateUserEntry;
}

export interface updateUserEntryVariables {
  entryUpdateInput: EntryUpdateInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserFeeds
// ====================================================

export interface UserFeeds_me_feeds_feed {
  __typename: "Feed";
  uri: string;
}

export interface UserFeeds_me_feeds {
  __typename: "UserFeed";
  id: string;
  name: string;
  enabled: boolean;
  feed: UserFeeds_me_feeds_feed;
}

export interface UserFeeds_me {
  __typename: "User";
  feeds: UserFeeds_me_feeds[];
}

export interface UserFeeds {
  me: UserFeeds_me;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: User
// ====================================================

export interface User_me {
  __typename: "User";
  name: string | null;
  avatarUrl: string | null;
}

export interface User {
  me: User_me;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserEntriesQuery
// ====================================================

export interface UserEntriesQuery_me_entries_edges_node_entry {
  __typename: "Entry";
  title: string;
  imageUrl: string | null;
  url: string;
}

export interface UserEntriesQuery_me_entries_edges_node {
  __typename: "UserEntry";
  id: string;
  status: UserEntryStatus;
  tags: string[];
  entry: UserEntriesQuery_me_entries_edges_node_entry;
}

export interface UserEntriesQuery_me_entries_edges {
  __typename: "UserEntryEdge";
  node: UserEntriesQuery_me_entries_edges_node | null;
  cursor: string;
}

export interface UserEntriesQuery_me_entries_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
}

export interface UserEntriesQuery_me_entries {
  __typename: "UserEntriesConnection";
  edges: (UserEntriesQuery_me_entries_edges | null)[];
  pageInfo: UserEntriesQuery_me_entries_pageInfo | null;
}

export interface UserEntriesQuery_me {
  __typename: "User";
  entries: UserEntriesQuery_me_entries;
}

export interface UserEntriesQuery {
  me: UserEntriesQuery_me;
}

export interface UserEntriesQueryVariables {
  status?: UserEntryStatus | null;
  afterCursor?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserEntriesCount
// ====================================================

export interface UserEntriesCount_NEW_entries {
  __typename: "UserEntriesConnection";
  totalCount: number;
}

export interface UserEntriesCount_NEW {
  __typename: "User";
  entries: UserEntriesCount_NEW_entries;
}

export interface UserEntriesCount_LATER_entries {
  __typename: "UserEntriesConnection";
  totalCount: number;
}

export interface UserEntriesCount_LATER {
  __typename: "User";
  entries: UserEntriesCount_LATER_entries;
}

export interface UserEntriesCount_FAVORITE_entries {
  __typename: "UserEntriesConnection";
  totalCount: number;
}

export interface UserEntriesCount_FAVORITE {
  __typename: "User";
  entries: UserEntriesCount_FAVORITE_entries;
}

export interface UserEntriesCount_ARCHIVED_entries {
  __typename: "UserEntriesConnection";
  totalCount: number;
}

export interface UserEntriesCount_ARCHIVED {
  __typename: "User";
  entries: UserEntriesCount_ARCHIVED_entries;
}

export interface UserEntriesCount {
  NEW: UserEntriesCount_NEW;
  LATER: UserEntriesCount_LATER;
  FAVORITE: UserEntriesCount_FAVORITE;
  ARCHIVED: UserEntriesCount_ARCHIVED;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: userEntry
// ====================================================

export interface userEntry_userEntry_entry {
  __typename: "Entry";
  url: string;
  title: string;
  content: string | null;
  author: string | null;
  publicationDate: any | null;
}

export interface userEntry_userEntry {
  __typename: "UserEntry";
  id: string;
  status: UserEntryStatus;
  progress: number | null;
  entry: userEntry_userEntry_entry;
}

export interface userEntry {
  userEntry: userEntry_userEntry;
}

export interface userEntryVariables {
  userEntryId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserEntryListFragment
// ====================================================

export interface UserEntryListFragment_entry {
  __typename: "Entry";
  title: string;
  imageUrl: string | null;
  url: string;
}

export interface UserEntryListFragment {
  __typename: "UserEntry";
  id: string;
  status: UserEntryStatus;
  tags: string[];
  entry: UserEntryListFragment_entry;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ToggleUserFeed
// ====================================================

export interface ToggleUserFeed {
  __typename: "UserFeed";
  id: string;
  enabled: boolean;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum UserEntryStatus {
  ARCHIVED = "ARCHIVED",
  FAVORITE = "FAVORITE",
  LATER = "LATER",
  NEW = "NEW",
}

export enum FeedType {
  RSS = "RSS",
}

// undefined
export interface AddUserEntryInput {
  url: string;
  creationDate?: any | null;
  status?: UserEntryStatus | null;
  tags?: string[] | null;
}

// undefined
export interface SubscribeToFeedInput {
  uri: string;
  name: string;
  type: FeedType;
}

// undefined
export interface BatchUpdateUserEntriesInput {
  ids?: string[] | null;
  status?: UserEntryStatus | null;
}

// undefined
export interface UserFeedUpdateInput {
  id: string;
  name?: string | null;
  enabled?: boolean | null;
}

// undefined
export interface EntryUpdateInput {
  id: string;
  progress?: number | null;
  status?: UserEntryStatus | null;
  tags?: string[] | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================