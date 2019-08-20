import { USER_ENTRIES_QUERY } from "../queries/userEntries";
import { query as UserEntriesCountsQuery } from "../queries/userEntriesCount";

function cleanUpOldLists(proxy, userEntry) {
  let oldStatus;

  // Update lists
  ["NEW", "LATER", "ARCHIVED", "FAVORITE"].forEach(status => {
    const queryToUpdate = { query: USER_ENTRIES_QUERY, variables: { status } };
    try {
      const data = proxy.readQuery(queryToUpdate);
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
      const queryToUpdate = { query: UserEntriesCountsQuery };
      const data = proxy.readQuery(queryToUpdate);
      data[oldStatus].entries.totalCount -= 1;
      proxy.writeQuery({ data, ...queryToUpdate });
    } catch (e) {}
  }
}

function writeToNewList(proxy, userEntry) {
  const queryToUpdate = { query: USER_ENTRIES_QUERY, variables: { status: userEntry.status } };

  // Update list
  try {
    const data = proxy.readQuery(queryToUpdate);
    data.me.entries.edges.unshift({ node: userEntry, cursor: null, __typename: "UserEntryEdge" });
    proxy.writeQuery({ data, ...queryToUpdate });
  } catch (e) {
    // console.warn(e);
  }

  // Update new status
  try {
    const queryToUpdate = { query: UserEntriesCountsQuery };
    const data = proxy.readQuery(queryToUpdate);
    data[userEntry.status].entries.totalCount += 1;
    proxy.writeQuery({ data, ...queryToUpdate });
  } catch (e) {}
}

function updateStore(proxy, userEntry) {
  cleanUpOldLists(proxy, userEntry);
  writeToNewList(proxy, userEntry);
}

export default updateStore;
