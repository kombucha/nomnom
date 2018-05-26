import { graphql } from "react-apollo";
import gql from "graphql-tag";

export const mutation = gql`
  mutation subscribeToFeed($subscribeToFeedInput: SubscribeToFeedInput!) {
    subscribeToFeed(subscribeToFeedInput: $subscribeToFeedInput) {
      id
    }
  }
`;

export const withMutation = graphql(mutation, {
  props: ({ mutate }) => ({
    subscribeToFeed: subscribeToFeedInput => mutate({ variables: { subscribeToFeedInput } })
  })
});

export default withMutation;
