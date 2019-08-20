import { graphql } from "@apollo/react-hoc";
import gql from "graphql-tag";

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
