import React from "react";
import { ApolloProvider } from "react-apollo";
import App, { Container } from "next/app";

import withApollo from "../hoc/withApollo";

class MyApp extends App {
  render() {
    const { Component, pageProps, apolloClient, router } = this.props;

    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} router={router} apolloClient={apolloClient} />
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApollo(MyApp);
