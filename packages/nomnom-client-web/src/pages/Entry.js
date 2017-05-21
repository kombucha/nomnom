import React, { PureComponent } from "react";
import { gql, graphql, compose } from "react-apollo";
import styled from "styled-components";

import EditEntryTagsDialog from "../components/EditEntryTagsDialog";
import PageTitle from "../components/PageTitle";
import FlatButton from "../components/FlatButton";
import { Card, CardTitle } from "../components/Card";

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const EntryCard = styled(Card)`
  max-width: 800px;
`;

const Article = styled.article`
  p {
    text-align: justify;
  }

  img {
    max-width: 100%;
  }

  blockquote {
    font-style: italic;
  }

  pre {
    overflow-x: scroll;
  }
`;

class Entry extends PureComponent {
  constructor() {
    super();
    this.state = {
      editingTags: false
    };
    this.archiveEntry = this.archiveEntry.bind(this);
    this.favoriteEntry = this.favoriteEntry.bind(this);
    this.editTags = this.editTags.bind(this);
  }

  renderLoading() {
    return (
      <div>
        <PageTitle value="Loading entry..." />
        Loading...
      </div>
    );
  }

  archiveEntry() {
    const { id } = this.props.data.userEntry;
    this.props.updateUserEntry({ id, status: "ARCHIVED" });
  }

  favoriteEntry() {
    const { id } = this.props.data.userEntry;
    this.props.updateUserEntry({ id, status: "FAVORITE" });
  }

  editTags() {
    this.setState({ editingTags: true });
  }

  renderEntry() {
    const { userEntry } = this.props.data;
    const { editingTags } = this.state;
    const htmlContent = {
      __html: userEntry.entry.content
    };

    const disableArchive = userEntry.status === "ARCHIVED";
    const disableFavorite = userEntry.status === "FAVORITE";
    const domain = new URL(userEntry.entry.url).host;
    const publicationDate = userEntry.entry.publicationDate
      ? new Date(userEntry.entry.publicationDate).toISOString()
      : "Unknown publication date";

    return (
      <EntryCard>
        <PageTitle value={userEntry.entry.title} />
        <CardTitle>{userEntry.entry.title}</CardTitle>

        <div>
          <div>
            <span> By {userEntry.entry.author}, </span>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={userEntry.entry.url}
            >
              {domain}
            </a>
            <br />
            <span>
              {publicationDate}
            </span>
          </div>
          <Article dangerouslySetInnerHTML={htmlContent} />
        </div>

        <div>
          <a href={userEntry.entry.url} target="__blank">
            <FlatButton>View original</FlatButton>
          </a>
          <FlatButton onClick={this.archiveEntry} disabled={disableArchive}>
            Archive
          </FlatButton>
          <FlatButton onClick={this.favoriteEntry} disabled={disableFavorite}>
            Favorite
          </FlatButton>
          <FlatButton onClick={this.editTags}>Edit tags</FlatButton>
        </div>

        <EditEntryTagsDialog
          userEntryId={userEntry.id}
          open={editingTags}
          onRequestClose={() => {
            this.setState({ editingTags: false });
          }}
        />
      </EntryCard>
    );
  }
  render() {
    const { data } = this.props;
    return (
      <Container>
        {data.loading ? this.renderLoading() : this.renderEntry()}
      </Container>
    );
  }
}

const query = gql`query userEntry($userEntryId: ID!) {
  userEntry(userEntryId: $userEntryId) {id status entry { url title content author publicationDate }}
}`;
// TODO: Update store
// http://dev.apollodata.com/react/cache-updates.html
const mutation = gql`mutation updateUserEntry($entryUpdateInput: EntryUpdateInput!) {
  updateUserEntry(entryUpdateInput: $entryUpdateInput) {id progress status tags lastUpdateDate}
}`;

const withQuery = graphql(query, {
  options: props => ({
    variables: {
      userEntryId: props.match.params.entryId
    }
  })
});
const withMutation = graphql(mutation, {
  props: ({ mutate }) => ({
    updateUserEntry: entryUpdateInput =>
      mutate({ variables: { entryUpdateInput } })
  })
});

const WrappedEntry = compose(withQuery, withMutation)(Entry);

export default WrappedEntry;
