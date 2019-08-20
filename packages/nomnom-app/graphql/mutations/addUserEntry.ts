import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import {
  AddUserEntryMutation,
  AddUserEntryMutationVariables,
  UserEntriesQuery,
  UserEntriesCount
} from "../../apollo-types";
import { UserEntryListFragment } from "../fragments/userEntry";
import { USER_ENTRIES_QUERY } from "../queries/userEntries";
import { USER_ENTRIES_COUNT_QUERY } from "../queries/userEntriesCount";

export const ADD_USER_ENTRY_MUTATION = gql`
  mutation AddUserEntryMutation($addUserEntryInput: AddUserEntryInput!) {
    addUserEntry(addUserEntryInput: $addUserEntryInput) {
      ...UserEntryListFragment
    }
  }
  ${UserEntryListFragment}
`;

const useAddUserEntryMutation = () => {
  const [addUserEntry] = useMutation<AddUserEntryMutation, AddUserEntryMutationVariables>(
    ADD_USER_ENTRY_MUTATION,
    {
      update: (proxy, result) => {
        const status = "LATER";
        // Update List
        try {
          const queryToUpdate = {
            query: USER_ENTRIES_QUERY,
            variables: { status }
          };

          const data = proxy.readQuery<UserEntriesQuery>(queryToUpdate);

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
          const countQueryToUpdate = { query: USER_ENTRIES_COUNT_QUERY };
          const data = proxy.readQuery<UserEntriesCount>(countQueryToUpdate);
          data[status].entries.totalCount += 1;
          proxy.writeQuery({ data, ...countQueryToUpdate });
        } catch (e) {
          console.log(e);
        }
      }
    }
  );

  return (url: string) => addUserEntry({ variables: { addUserEntryInput: { url } } });
};

export default useAddUserEntryMutation;
