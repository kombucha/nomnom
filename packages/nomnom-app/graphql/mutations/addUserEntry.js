import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { UserEntryListFragment } from "../fragments/userEntry";
import { query as EntriesListQuery } from "../queries/userEntries";
import { query as UserEntriesCountsQuery } from "../queries/userEntriesCount";

export const mutation = gql`
  mutation addUserEntry($addUserEntryInput: AddUserEntryInput!) {
    addUserEntry(addUserEntryInput: $addUserEntryInput) {
      ...UserEntryListFragment
    }
  }
  ${UserEntryListFragment}
`;

export const withMutation = graphql(mutation, {
  props: ({ mutate }) => ({
    addUserEntry: addUserEntryInput =>
      mutate({
        variables: { addUserEntryInput },
        update: (proxy, result) => {
          const status = "LATER";
          // Update List
          try {
            const queryToUpdate = {
              query: EntriesListQuery,
              variables: { status }
            };

            const data = proxy.readQuery(queryToUpdate);

            // TODO: handle duplicates
            data.me.entries.edges.unshift({
              node: result.data.addUserEntry,
              cursor: null, // Not sure about that...
              __typename: "UserEntryEdge"
            });
            proxy.writeQuery({ data, ...queryToUpdate });
          } catch (e) {}

          // Update count
          try {
            const countQueryToUpdate = { query: UserEntriesCountsQuery };
            const data = proxy.readQuery(countQueryToUpdate);
            data[status].entries.totalCount += 1;
            proxy.writeQuery({ data, ...countQueryToUpdate });
          } catch (e) {
            console.log(e);
          }
        }
      })
  })
});

export default withMutation;
