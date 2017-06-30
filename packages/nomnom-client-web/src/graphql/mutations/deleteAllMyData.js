import { gql, graphql } from "react-apollo";

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
