import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { UserEntryListFragment } from "../fragments/userEntry";
import updateStore from "./userEntryUpdateHelper";

export const mutation = gql`
  mutation batchUpdateUserEntries($batchUpdateUserEntriesInput: BatchUpdateUserEntriesInput!) {
    batchUpdateUserEntries(batchUpdateUserEntriesInput: $batchUpdateUserEntriesInput) {
      ...UserEntryListFragment
    }
  }
  ${UserEntryListFragment}
`;

export const withMutation = graphql(mutation, {
  props: ({ mutate }) => ({
    batchUpdateUserEntries: batchUpdateUserEntriesInput =>
      mutate({
        variables: { batchUpdateUserEntriesInput },
        update: (proxy, result) => {
          result.data.batchUpdateUserEntries.forEach(userEntry => {
            updateStore(proxy, userEntry);
          });
        }
      })
  })
});

export default withMutation;
