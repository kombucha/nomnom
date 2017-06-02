import { gql, graphql } from "react-apollo";

export const query = gql`query($status: UserEntryStatus, $afterCursor: String) {
  me {
    entries(status: $status, first: 20, after: $afterCursor) {
      edges { node {id status tags entry {title imageUrl url}}, cursor }
      pageInfo { hasNextPage }
    }
  }
}`;

export const withQuery = graphql(query, {
  options: ({ status }) => ({
    variables: { status },
    notifyOnNetworkStatusChange: true
  }),
  props({ data }) {
    const endCursor = data.me && data.me.entries.edges.length > 0
      ? data.me.entries.edges[data.me.entries.edges.length - 1].cursor
      : null;
    const entries = data.me ? data.me.entries.edges.map(edge => edge.node) : [];
    const hasMore = data.me ? data.me.entries.pageInfo.hasNextPage : false;

    return {
      entries,
      hasMore,
      loading: data.loading,
      refetch: () => data.refetch(),
      fetchMore: () => {
        return data.fetchMore({
          variables: { afterCursor: endCursor },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }

            return {
              me: {
                ...previousResult.me,
                entries: {
                  ...previousResult.me.entries,
                  edges: [...previousResult.me.entries.edges, ...fetchMoreResult.me.entries.edges],
                  pageInfo: fetchMoreResult.me.entries.pageInfo
                }
              }
            };
          }
        });
      }
    };
  }
});

export default withQuery;
