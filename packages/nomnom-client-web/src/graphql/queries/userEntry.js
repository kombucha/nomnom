import { gql, graphql } from "react-apollo";

export const query = gql`query userEntry($userEntryId: ID!) {
  userEntry(userEntryId: $userEntryId) {id status entry { url title content author publicationDate }}
}`;

export const withQuery = graphql(query, {
  options: props => ({
    variables: {
      userEntryId: props.match.params.entryId
    }
  }),
  props: ({ data }) => ({
    userEntry: data.userEntry,
    loading: data.loading
  })
});

export default withQuery;
