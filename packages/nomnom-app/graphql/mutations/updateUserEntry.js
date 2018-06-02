import { graphql } from "react-apollo";
import gql from "graphql-tag";

import updateStore from "./userEntryUpdateHelper";

export const mutation = gql`
  mutation updateUserEntry($entryUpdateInput: EntryUpdateInput!) {
    updateUserEntry(entryUpdateInput: $entryUpdateInput) {
      id
      progress
      status
      tags
      lastUpdateDate
    }
  }
`;

export const withMutation = graphql(mutation, {
  props: ({ mutate }) => ({
    updateUserEntry: entryUpdateInput =>
      mutate({
        variables: { entryUpdateInput },
        update: (proxy, result) => {
          updateStore(proxy, result.data.updateUserEntry);
        }
      })
  })
});

export default withMutation;
