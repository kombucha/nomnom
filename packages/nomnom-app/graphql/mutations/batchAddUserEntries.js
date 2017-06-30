import { gql, graphql } from "react-apollo";

export const mutation = gql`
  mutation batchAddUserEntries($batchAddUserEntriesInput: [AddUserEntryInput!]!) {
    batchAddUserEntries(batchAddUserEntriesInput: $batchAddUserEntriesInput) {
      id
    }
  }
`;

export const withMutation = graphql(mutation, {
  props: ({ mutate }) => ({
    batchAddUserEntries: batchAddUserEntriesInput =>
      mutate({ variables: { batchAddUserEntriesInput } })
  })
});

export default withMutation;
