import React from "react";
import cookie from "cookie";
import { getDataFromTree } from "@apollo/react-ssr";
import { ApolloProvider } from "@apollo/react-common";
import ApolloClient from "apollo-client";
import App, { AppContext, Container } from "next/app";
import Head from "next/head";

import initApollo from "../services/initApollo";
import { IncomingMessage } from "http";

type Props = { apolloClient?: ApolloClient<any>; apolloState?: any };

function parseCookies(req?: IncomingMessage) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}

class MyApp extends App<Props> {
  static async getInitialProps(appContext: AppContext): Promise<MyApp["props"]> {
    const AppTree: React.ComponentType<any> = appContext.AppTree;
    const { req, res } = appContext.ctx;
    const apollo = initApollo({}, { getToken: () => parseCookies(req).token });

    (appContext.ctx as any).apolloClient = apollo;

    const appProps: any = await App.getInitialProps(appContext);
    const apolloState = { data: {} };

    if (res && res.finished) {
      // When redirecting, the response is finished.
      // No point in continuing to render
      return { ...appProps };
    }

    if (!process.browser) {
      // Run all graphql queries in the component tree
      // and extract the resulting data
      try {
        // Run all GraphQL queries
        await getDataFromTree(<AppTree {...appProps} apolloClient={apollo} />);
      } catch (error) {
        // Prevent Apollo Client GraphQL errors from crashing SSR.
        // Handle them in components via the data.error prop:
        // http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
        console.error("Error while running `getDataFromTree`", error);
      }

      // getDataFromTree does not call componentWillUnmount
      // head side effect therefore need to be cleared manually
      Head.rewind();
    }

    // Extract query data from the Apollo's store
    apolloState.data = apollo.cache.extract();

    return { apolloState, ...appProps };
  }

  render() {
    const { Component, pageProps, router } = this.props;

    // `getDataFromTree` renders the component first, the client is passed off as a property.
    // After that rendering is done using Next's normal rendering pipeline
    const apolloClient =
      this.props.apolloClient ||
      initApollo(this.props.apolloState.data, { getToken: () => parseCookies().token });

    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} router={router} apolloClient={apolloClient} />
        </ApolloProvider>
      </Container>
    );
  }
}

export default MyApp;
