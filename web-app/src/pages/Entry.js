import React, { Component } from "react";
import { Card, CardTitle, CardText } from "material-ui/Card";
import { gql, graphql } from "react-apollo";

const STYLES = {
  container: {
    padding: 20
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
      <Card>
        <CardTitle title={userEntry.entry.title} />
        <CardText>
          <div className="content" dangerouslySetInnerHTML={htmlContent} />
        </CardText>
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
  userEntry(userEntryId: $userEntryId) {id entry { title content }} 
}`;
const EntryWithData = graphql(query, {
  options: props => ({
    variables: {
      userEntryId: props.match.params.entryId
    }
  })
})(Entry);

export default EntryWithData;
