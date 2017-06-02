import { gql, graphql } from "react-apollo";

export const mutation = gql`mutation addUserEntry($addUserEntryInput: AddUserEntryInput!) {
  addUserEntry(addUserEntryInput: $addUserEntryInput) {id}
}`;

export const withMutation = graphql(mutation, {
  props: ({ mutate }) => ({
    addUserEntry: addUserEntryInput => mutate({ variables: { addUserEntryInput } })
  })
});

export default withMutation;
