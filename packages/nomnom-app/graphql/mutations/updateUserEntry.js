import { gql, graphql } from "react-apollo";

// TODO: Update store
// http://dev.apollodata.com/react/cache-updates.html
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
    updateUserEntry: entryUpdateInput => mutate({ variables: { entryUpdateInput } })
  })
});

export default withMutation;
