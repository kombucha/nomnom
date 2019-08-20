import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { userEntry, userEntryVariables } from "../../apollo-types";

export const USER_ENTRY_QUERY = gql`
  query userEntry($userEntryId: ID!) {
    userEntry(userEntryId: $userEntryId) {
      id
      status
      progress
      entry {
        url
        title
        content
        author
        publicationDate
      }
    }
  }
`;

export const useUserEntry = (userEntryId: string) =>
  useQuery<userEntry, userEntryVariables>(USER_ENTRY_QUERY, {
    variables: { userEntryId }
  });

export default useUserEntry;
