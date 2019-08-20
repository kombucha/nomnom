import { graphql } from "@apollo/react-hoc";
import gql from "graphql-tag";

export const query = gql`
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

export const withQuery = graphql(query);

export default withQuery;
