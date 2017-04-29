import React, { Component } from "react";
import { Card, CardTitle, CardText, CardActions } from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import { gql, graphql, compose } from "react-apollo";

import "./Entry.css";
import EditEntryTagsDialog from "../components/EditEntryTagsDialog";

const STYLES = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: 20
  },
  article: {
    maxWidth: 800
  }
};

class Entry extends Component {
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
    return <div>Loading...</div>;
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
      <Card style={STYLES.article}>
        <CardTitle title={userEntry.entry.title} />
        <CardText>
          <div>
            <span> By {userEntry.entry.author}, </span>
            <a target="_blank" href={userEntry.entry.url}>{domain}</a> <br />
            <span>
              {publicationDate}
            </span>
          </div>
          <div className="entry-content" dangerouslySetInnerHTML={htmlContent} />
        </CardText>
        <CardActions>
          <a href={userEntry.entry.url} target="__blank">
            <FlatButton label="View original" />
          </a>
          <FlatButton label="Archive" onTouchTap={this.archiveEntry} disabled={disableArchive} />
          <FlatButton label="Favorite" onTouchTap={this.favoriteEntry} disabled={disableFavorite} />
          <FlatButton label="Edit tags" onTouchTap={this.editTags} />
        </CardActions>

        <EditEntryTagsDialog
          userEntryId={userEntry.id}
          open={editingTags}
          onRequestClose={() => {
            this.setState({ editingTags: false });
          }}
        />
      </Card>
    );
  }
  render() {
    const { data } = this.props;
    return (
      <div style={STYLES.container}>
        {data.loading ? this.renderLoading() : this.renderEntry()}
      </div>
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
    updateUserEntry: entryUpdateInput => mutate({ variables: { entryUpdateInput } })
  })
});

const WrappedEntry = compose(withQuery, withMutation)(Entry);

export default WrappedEntry;
