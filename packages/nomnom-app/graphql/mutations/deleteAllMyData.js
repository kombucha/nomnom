import { graphql } from "@apollo/react-hoc";
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
