import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { compose, mapProps } from "recompose";
import styled from "styled-components";
import { Url as URL } from "url";

import FlatButton from "../toolkit/FlatButton";
import { Card, CardTitle } from "../toolkit/Card";

import withData from "../components/withData";
import PageWrapper from "../components/PageWrapper";
import EditEntryTagsDialog from "../components/EditEntryTagsDialog";
import PageTitle from "../components/PageTitle";
import userEntryContainer from "../graphql/queries/userEntry";
import updateUserEntryContainer from "../graphql/mutations/updateUserEntry";

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

export class Entry extends PureComponent {
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
    const { id } = this.props.userEntry;
    this.props.updateUserEntry({ id, status: "ARCHIVED" });
  }

  favoriteEntry() {
    const { id } = this.props.userEntry;
    this.props.updateUserEntry({ id, status: "FAVORITE" });
  }

  editTags() {
    this.setState({ editingTags: true });
  }

  renderEntry(userEntry) {
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
        <CardTitle>
          {userEntry.entry.title}
        </CardTitle>

        <div>
          <div>
            <span>
              {" "}By {userEntry.entry.author},{" "}
            </span>
            <a target="_blank" rel="noopener noreferrer" href={userEntry.entry.url}>
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
    const { userEntry, loading } = this.props;
    return (
      <PageWrapper>
        <Container>
          {loading ? this.renderLoading() : this.renderEntry(userEntry)}
        </Container>
      </PageWrapper>
    );
  }
}

Entry.propTypes = {
  userEntry: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  updateUserEntry: PropTypes.func.isRequired
};

const paramsFromUrl = mapProps(({ url }) => ({ entryId: url.query.entryId }));

export default compose(withData, paramsFromUrl, userEntryContainer, updateUserEntryContainer)(
  Entry
);
