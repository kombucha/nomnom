import gql from "graphql-tag";

export const UserEntryListFragment = gql`
  fragment UserEntryListFragment on UserEntry {
    id
    status
    tags
    entry {
      title
      imageUrl
      url
    }
  }
`;
