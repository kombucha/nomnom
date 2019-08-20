import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { UserFeeds } from "../../apollo-types";

export const USER_FEEDS_QUERY = gql`
  query UserFeeds {
    me {
      feeds {
        id
        name
        enabled
        feed {
          uri
        }
      }
    }
  }
`;

export const useFeeds = () => useQuery<UserFeeds>(USER_FEEDS_QUERY);

export default useFeeds;
