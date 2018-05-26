import { graphql } from "react-apollo";
import gql from "graphql-tag";

export const query = gql`
  query {
    me {
      name
      avatarUrl
    }
  }
`;

export const withQuery = graphql(query, {
  skip: props => !props.authenticated,
  props: ({ data }) => ({
    user: data.me
  })
});

export default withQuery;
