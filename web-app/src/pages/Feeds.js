import React, { Component } from "react";
import { gql, graphql } from "react-apollo";

import PageTitle from "../components/PageTitle";

export class Feeds extends Component {
  render() {
    return (
      <div>
        <PageTitle value="Feeds" />
        Hello feeds
      </div>
    );
  }
}

const query = gql`query {
  me {
    feeds {id enabled feed {id uri}}
  }
}`;

const FeedsWithData = graphql(query)(Feeds);

export default FeedsWithData;
