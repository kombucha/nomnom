import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { compose, mapProps } from "recompose";
import styled from "styled-components";
import { Url as URL } from "url";

import FlatButton from "../toolkit/FlatButton";
import { Card, CardTitle } from "../toolkit/Card";

import withAuth from "../components/hoc/withAuth";
import PageTitle from "../components/PageTitle";
import ScrollPercentage from "../components/ScrollPercentage";
import PageWrapper from "../components/PageWrapper";
import EditEntryTagsDialog from "../components/EditEntryTagsDialog";
import userEntryContainer from "../graphql/queries/userEntry";
import updateUserEntryContainer from "../graphql/mutations/updateUserEntry";
import { setScrollPercent } from "../services/scrolling";

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const EntryCard = styled(Card)`
  max-width: 800px;
`;

const Article = styled.article`
  .nomnom-youtube-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;

    > iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

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

const ProgressBar = styled.div`
  position: fixed;
  top: ${props => props.theme.appBarHeight};
  left: 0;
  height: 4px;
  background-color: ${props => props.theme.accent1Color};
  transition: width 500ms;
`;

export class Entry extends PureComponent {
  state = { editingTags: false };

  _archiveEntry = () => {
    const { id } = this.props.userEntry;
    this.props.updateUserEntry({ id, status: "ARCHIVED" });
  };

  _favoriteEntry = () => {
    const { id } = this.props.userEntry;
    this.props.updateUserEntry({ id, status: "FAVORITE" });
  };

  _handleProgressUpdate = progress => {
    const { id } = this.props.userEntry;
    this.props.updateUserEntry({ id, progress });
  };

  _editTags = () => {
    this.setState({ editingTags: true });
  };

  _renderLoading = () => {
    return (
      <div>
        <PageTitle value="Loading entry..." />
        Loading...
      </div>
    );
  };

  _renderEntry = userEntry => {
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
      <div>
        <PageTitle value={userEntry.entry.title} />
        <ScrollPercentage onChange={this._handleProgressUpdate} />

        <ProgressBar style={{ width: `${userEntry.progress}%` }} />

        <EntryCard>
          <CardTitle>{userEntry.entry.title}</CardTitle>

          <div>
            <div>
              <span>By {userEntry.entry.author},</span>
              <a target="_blank" rel="noopener noreferrer" href={userEntry.entry.url}>
                {domain}
              </a>
              <br />
              <span>{publicationDate}</span>
            </div>
            <Article dangerouslySetInnerHTML={htmlContent} />
          </div>

          <div>
            <a href={userEntry.entry.url} target="__blank">
              <FlatButton>View original</FlatButton>
            </a>
            <FlatButton onClick={this._archiveEntry} disabled={disableArchive}>
              Archive
            </FlatButton>
            <FlatButton onClick={this._favoriteEntry} disabled={disableFavorite}>
              Favorite
            </FlatButton>
            <FlatButton onClick={this._editTags}>Edit tags</FlatButton>
          </div>
        </EntryCard>

        <EditEntryTagsDialog
          userEntryId={userEntry.id}
          open={editingTags}
          onRequestClose={() => {
            this.setState({ editingTags: false });
          }}
        />
      </div>
    );
  };

  componentDidUpdate() {
    const { userEntry } = this.props;
    if (userEntry) {
      const progressPercent = userEntry.progress ? userEntry.progress / 100 : 0;
      // FIXME: Broken, need to take into account image loading because it affects the height !
      this.scrollTimeout = setTimeout(() => setScrollPercent(progressPercent), 100);
    }
  }

  componentWillUnmount() {
    if (this.scrollTimeout) {
      window.clearTimeout(this.scrollTimeout);
    }
  }

  render() {
    const { userEntry, loading, loggedInUser } = this.props;
    return (
      <PageWrapper user={loggedInUser}>
        <Container>{loading ? this._renderLoading() : this._renderEntry(userEntry)}</Container>
      </PageWrapper>
    );
  }
}

Entry.propTypes = {
  userEntry: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  updateUserEntry: PropTypes.func.isRequired
};

const mappedProps = mapProps(({ router, loggedInUser }) => ({
  entryId: router.query.entryId,
  loggedInUser
}));

export default compose(withAuth, mappedProps, userEntryContainer, updateUserEntryContainer)(Entry);
