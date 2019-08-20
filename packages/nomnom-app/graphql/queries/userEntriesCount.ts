import { graphql } from "@apollo/react-hoc";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { UserEntriesCount } from "../../apollo-types";

export const USER_ENTRIES_COUNT_QUERY = gql`
  query UserEntriesCount {
    NEW: me {
      entries(status: NEW) {
        totalCount
      }
    }
    LATER: me {
      entries(status: LATER) {
        totalCount
      }
    }
    FAVORITE: me {
      entries(status: FAVORITE) {
        totalCount
      }
    }
    ARCHIVED: me {
      entries(status: ARCHIVED) {
        totalCount
      }
    }
  }
`;

export const useUserEntriesCount = () => {
  const { data } = useQuery<UserEntriesCount>(USER_ENTRIES_COUNT_QUERY);

  if (!data.NEW) return [];

  return [
    { value: "NEW", label: "New", totalCount: data.NEW.entries.totalCount },
    { value: "LATER", label: "Later", totalCount: data.LATER.entries.totalCount },
    { value: "FAVORITE", label: "Favorite", totalCount: data.FAVORITE.entries.totalCount },
    { value: "ARCHIVED", label: "Archived", totalCount: data.ARCHIVED.entries.totalCount }
  ];
};

export default useUserEntriesCount;
