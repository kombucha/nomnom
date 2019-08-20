import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { ToggleUserFeedMutation, ToggleUserFeedMutationVariables } from "../../apollo-types";

export const TOGGLE_USER_FEED_MUTATION = gql`
  mutation ToggleUserFeedMutation($userFeedUpdateInput: UserFeedUpdateInput!) {
    updateUserFeed(userFeedUpdateInput: $userFeedUpdateInput) {
      id
      enabled
    }
  }
`;

export const useToggleUserFeed = (id: string) => (enabled: boolean) => {
  const [toggleUserFeed] = useMutation<ToggleUserFeedMutation, ToggleUserFeedMutationVariables>(
    TOGGLE_USER_FEED_MUTATION,
    {
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
    }
  );

  return toggleUserFeed();
};

export default useToggleUserFeed;
