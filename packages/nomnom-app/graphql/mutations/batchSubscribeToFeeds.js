import { graphql } from "react-apollo";
import gql from "graphql-tag";

const mutation = gql`
  mutation batchSubscribeToFeeds($batchSubscribeToFeedsInput: [SubscribeToFeedInput!]!) {
    batchSubscribeToFeeds(batchSubscribeToFeedsInput: $batchSubscribeToFeedsInput) {
      id
    }
  }
`;

export const withMutation = graphql(mutation, {
  props: ({ mutate }) => ({
    batchSubscribeToFeeds: batchSubscribeToFeedsInput =>
      mutate({ variables: { batchSubscribeToFeedsInput } })
  })
});

export default withMutation;
