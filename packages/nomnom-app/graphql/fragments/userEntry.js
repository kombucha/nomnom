import { gql } from "react-apollo";

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
