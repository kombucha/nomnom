import gql from "graphql-tag";

export const USER_QUERY = gql`
  query User {
    me {
      name
      avatarUrl
    }
  }
`;
