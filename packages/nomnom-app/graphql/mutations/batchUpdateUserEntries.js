import { gql, graphql } from "react-apollo";
import { UserEntryListFragment } from "../fragments/userEntry";
import { query as EntriesListQuery } from "../queries/userEntries";

export const mutation = gql`
  mutation batchUpdateUserEntries($batchUpdateUserEntriesInput: BatchUpdateUserEntriesInput!) {
    batchUpdateUserEntries(batchUpdateUserEntriesInput: $batchUpdateUserEntriesInput) {...UserEntryListFragment}
  }
  ${UserEntryListFragment}
  `;

function cleanUpOldLists(proxy, userEntry) {
  ["NEW", "LATER", "ARCHIVED", "FAVORITE"].forEach(status => {
    const queryToUpdate = { query: EntriesListQuery, variables: { status } };
    try {
      const data = proxy.readQuery(queryToUpdate);
      data.me.entries.edges = data.me.entries.edges.filter(edge => edge.node.id !== userEntry.id);

      proxy.writeQuery({ data, ...queryToUpdate });
    } catch (e) {
      // console.warn(e);
    }
  });
}

function writeToNewList(proxy, userEntry) {
  const queryToUpdate = { query: EntriesListQuery, variables: { status: userEntry.status } };
  try {
    const data = proxy.readQuery(queryToUpdate);
    data.me.entries.edges.unshift({ node: userEntry, cursor: null, __typename: "UserEntryEdge" });

    proxy.writeQuery({ data, ...queryToUpdate });
  } catch (e) {
    // console.warn(e);
  }
}

export const withMutation = graphql(mutation, {
  props: ({ mutate }) => ({
    batchUpdateUserEntries: batchUpdateUserEntriesInput =>
      mutate({
        variables: { batchUpdateUserEntriesInput },
        update: (proxy, result) => {
          result.data.batchUpdateUserEntries.forEach(userEntry => {
            cleanUpOldLists(proxy, userEntry);
            writeToNewList(proxy, userEntry);
          });
        }
      })
  })
});

export default withMutation;
