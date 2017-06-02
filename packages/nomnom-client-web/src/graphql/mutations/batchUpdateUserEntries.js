import { gql, graphql } from "react-apollo";

export const mutation = gql`mutation batchUpdateUserEntries($batchUpdateUserEntriesInput: BatchUpdateUserEntriesInput!) {
  batchUpdateUserEntries(batchUpdateUserEntriesInput: $batchUpdateUserEntriesInput) {id status lastUpdateDate}
}`;

export const withMutation = graphql(mutation, {
  props: ({ mutate }) => ({
    batchUpdateUserEntries: batchUpdateUserEntriesInput =>
      mutate({
        variables: { batchUpdateUserEntriesInput },
        update: (proxy, data) => {
          // try {
          //   const entriesList = proxy.readQuery({ query, variables: { status: "LATER" } });
          // } catch (e) {
          //   console.warn("Other list doesnt exist yet so cool");
          // }
        }
      })
  })
});

export default withMutation;
