import { graphql } from "react-apollo";
import gql from "graphql-tag";

export const query = gql`
  {
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

export const withQuery = graphql(query, {
  props({ data }) {
    if (!data.NEW) return { statuses: [] };

    return {
      statuses: [
        { value: "NEW", label: "New", totalCount: data.NEW.entries.totalCount },
        { value: "LATER", label: "Later", totalCount: data.LATER.entries.totalCount },
        { value: "FAVORITE", label: "Favorite", totalCount: data.FAVORITE.entries.totalCount },
        { value: "ARCHIVED", label: "Archived", totalCount: data.ARCHIVED.entries.totalCount }
      ]
    };
  }
});

export default withQuery;
