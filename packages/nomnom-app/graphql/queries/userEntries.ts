import gql from "graphql-tag";
import uniqBy from "lodash/uniqby";

import { UserEntryListFragment } from "../fragments/userEntry";
import {
  UserEntryStatus,
  UserEntriesQuery,
  UserEntriesQueryVariables,
  UserEntriesQuery_me_entries_edges_node
} from "../../apollo-types";
import { useQuery } from "@apollo/react-hooks";

export const USER_ENTRIES_QUERY = gql`
  query UserEntriesQuery($status: UserEntryStatus, $afterCursor: String) {
    me {
      entries(status: $status, first: 20, after: $afterCursor) {
        edges {
          node {
            ...UserEntryListFragment
          }
          cursor
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }
  ${UserEntryListFragment}
`;

export type UserEntry = UserEntriesQuery_me_entries_edges_node;

const useUserEntries = (status?: UserEntryStatus) => {
  const { data, loading, refetch, fetchMore } = useQuery<
    UserEntriesQuery,
    UserEntriesQueryVariables
  >({
    variables: { status },
    notifyOnNetworkStatusChange: true
  });

  const entries = data.me ? data.me.entries.edges.map(edge => edge.node) : [];
  const hasMore = data.me ? data.me.entries.pageInfo.hasNextPage : false;
  const endCursor =
    data.me && data.me.entries.edges.length > 0
      ? data.me.entries.edges[data.me.entries.edges.length - 1].cursor
      : null;

  return {
    entries,
    hasMore,
    loading,
    refetch,
    fetchMore: () =>
      fetchMore({
        variables: { afterCursor: endCursor },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          const newEdges = uniqBy(
            [...previousResult.me.entries.edges, ...fetchMoreResult.me.entries.edges],
            edge => edge.node.id
          );

          return {
            me: {
              ...previousResult.me,
              entries: {
                ...previousResult.me.entries,
                edges: newEdges,
                pageInfo: fetchMoreResult.me.entries.pageInfo
              }
            }
          };
        }
      })
  };
};

export default useUserEntries;
