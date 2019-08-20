import { DataProxy } from "apollo-cache";

import { UserEntryStatus, UserEntriesQuery } from "../../apollo-types";
import { USER_ENTRIES_QUERY, UserEntry } from "../queries/userEntries";
import { USER_ENTRIES_COUNT_QUERY } from "../queries/userEntriesCount";

function cleanUpOldLists(proxy: DataProxy, userEntry: UserEntry) {
  let oldStatus: UserEntryStatus;

  // Update lists
  Object.values(UserEntryStatus).forEach((status: UserEntryStatus) => {
    const queryToUpdate = { query: USER_ENTRIES_QUERY, variables: { status } };
    try {
      const data = proxy.readQuery<UserEntriesQuery>(queryToUpdate);
      const containsEntry = data.me.entries.edges.some(edge => edge.node.id === userEntry.id);

      if (containsEntry) {
        oldStatus = status;
        data.me.entries.edges = data.me.entries.edges.filter(edge => edge.node.id !== userEntry.id);
        proxy.writeQuery({ data, ...queryToUpdate });
      }
    } catch (e) {
      // console.warn(e);
    }
  });

  // Update counts
  if (oldStatus) {
    try {
      const queryToUpdate = { query: USER_ENTRIES_COUNT_QUERY };
      const data = proxy.readQuery(queryToUpdate);
      data[oldStatus].entries.totalCount -= 1;
      proxy.writeQuery({ data, ...queryToUpdate });
    } catch (e) {}
  }
}

function writeToNewList(proxy: DataProxy, userEntry: UserEntry) {
  const queryToUpdate = { query: USER_ENTRIES_QUERY, variables: { status: userEntry.status } };

  // Update list
  try {
    const data = proxy.readQuery<UserEntriesQuery>(queryToUpdate);
    data.me.entries.edges.unshift({ node: userEntry, cursor: null, __typename: "UserEntryEdge" });
    proxy.writeQuery({ data, ...queryToUpdate });
  } catch (e) {
    // console.warn(e);
  }

  // Update new status
  try {
    const queryToUpdate = { query: USER_ENTRIES_COUNT_QUERY };
    const data = proxy.readQuery(queryToUpdate);
    data[userEntry.status].entries.totalCount += 1;
    proxy.writeQuery({ data, ...queryToUpdate });
  } catch (e) {}
}

function updateStore(proxy: DataProxy, userEntry: UserEntry) {
  cleanUpOldLists(proxy, userEntry);
  writeToNewList(proxy, userEntry);
}

export default updateStore;
