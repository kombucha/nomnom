import React, { Component } from "react";
import { Card, CardTitle, CardText, CardActions } from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import { gql, graphql } from "react-apollo";

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
  renderLoading() {
    return <div>Loading...</div>;
  }

  renderEntry() {
    const { userEntry } = this.props.data;
    const htmlContent = {
      __html: userEntry.entry.content
    };

    return (
      <Card style={STYLES.article}>
        <CardTitle title={userEntry.entry.title} />
        <CardText>
          <div className="content" dangerouslySetInnerHTML={htmlContent} />
        </CardText>
        <CardActions>
          <a href={userEntry.entry.url} target="__blank">
            <FlatButton label="View original" />
          </a>
          <FlatButton label="Archive" disabled />
          <FlatButton label="Favorite" disabled />
        </CardActions>
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

const query = gql`query ($userEntryId: ID!) { 
  userEntry(userEntryId: $userEntryId) {id entry { url title content }} 
}`;
const EntryWithData = graphql(query, {
  options: props => ({
    variables: {
      userEntryId: props.match.params.entryId
    }
  })
})(Entry);

export default EntryWithData;
