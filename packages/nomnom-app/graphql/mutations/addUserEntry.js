import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { UserEntryListFragment } from "../fragments/userEntry";
import { query as EntriesListQuery } from "../queries/userEntries";

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
          try {
            const queryToUpdate = {
              query: EntriesListQuery,
              variables: { status: "LATER" }
            };

            const data = proxy.readQuery(queryToUpdate);

            // TODO: handle duplicates
            data.me.entries.edges.unshift({
              node: result.data.addUserEntry,
              cursor: null, // Not sure about that...
              __typename: "UserEntryEdge"
            });

            proxy.writeQuery({ data, ...queryToUpdate });
          } catch (e) {
            console.error(e);
          }
        }
      })
  })
});

export default withMutation;
