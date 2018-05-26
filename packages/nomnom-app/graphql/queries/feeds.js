import { graphql } from "react-apollo";
import gql from "graphql-tag";

export const query = gql`
  query {
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
