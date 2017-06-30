import { gql, graphql } from "react-apollo";

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
