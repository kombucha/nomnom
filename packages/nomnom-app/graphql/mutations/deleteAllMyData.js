import { graphql } from "react-apollo";
import gql from "graphql-tag";

export const mutation = gql`
  mutation deleteAllMyData {
    deleteAllMyData
  }
`;

export const withMutation = graphql(mutation, {
  props: ({ mutate }) => ({
    deleteAllMyData: () => mutate()
  })
});

export default withMutation;
