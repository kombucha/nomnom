import { graphql } from "@apollo/react-hoc";
import gql from "graphql-tag";

export const mutation = gql`
  mutation updateUserFeed($userFeedUpdateInput: UserFeedUpdateInput!) {
    updateUserFeed(userFeedUpdateInput: $userFeedUpdateInput) {
      id
      enabled
    }
  }
`;

export const withMutation = graphql(mutation, {
  props: ({ mutate }) => ({
    toggleUserFeed: (id, enabled) =>
      mutate({
        variables: { userFeedUpdateInput: { id, enabled } },
        update: (proxy, result) => {
          const fragment = gql`
            fragment ToggleUserFeed on UserFeed {
              id
              enabled
              __typename
            }
          `;

          proxy.writeFragment({
            id,
            fragment,
            data: result.data.updateUserFeed
          });
        }
      })
  })
});

export default withMutation;
