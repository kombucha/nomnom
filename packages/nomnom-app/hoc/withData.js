import React from "react";
import PropTypes from "prop-types";
import { ApolloProvider, getDataFromTree } from "react-apollo";
import cookie from "cookie";

import initApollo from "../services/createApolloClient";

function parseCookies(ctx) {
  return cookie.parse(process.browser ? document.cookie : ctx.req.headers.cookie);
}

export default ComposedComponent => {
  return class WithData extends React.Component {
    static displayName = `WithData(${ComposedComponent.displayName})`;
    static propTypes = {
      serverState: PropTypes.object.isRequired
    };

    static async getInitialProps(context) {
      let serverState = {};

      // Setup a server-side one-time-use apollo client for initial props and
      // rendering (on server)
      let apollo = initApollo(
        {},
        {
          getToken: () => parseCookies(context).token
        }
      );

      // Evaluate the composed component's getInitialProps()
      let composedInitialProps = {};
      if (ComposedComponent.getInitialProps) {
        composedInitialProps = await ComposedComponent.getInitialProps(context, apollo);
      }

      // Run all graphql queries in the component tree
      // and extract the resulting data
      if (!process.browser) {
        if (context.res && context.res.finished) {
          // When redirecting, the response is finished.
          // No point in continuing to render
          return;
        }

        // Provide the `url` prop data in case a graphql query uses it
        const url = { query: context.query, pathname: context.pathname };

        // Run all graphql queries
        const app = (
          <ApolloProvider client={apollo}>
            <ComposedComponent url={url} {...composedInitialProps} />
          </ApolloProvider>
        );
        await getDataFromTree(app);

        // Extract query data from the Apollo's store
        const state = apollo.getInitialState();

        serverState = {
          apollo: {
            // Make sure to only include Apollo's data state
            data: state.data
          }
        };
      }

      return {
        serverState,
        ...composedInitialProps
      };
    }

    constructor(props) {
      super(props);
      // Note: Apollo should never be used on the server side beyond the initial
      // render within `getInitialProps()` above (since the entire prop tree
      // will be initialized there), meaning the below will only ever be
      // executed on the client.
      this.apollo = initApollo(this.props.serverState, {
        getToken: () => parseCookies().token
      });
    }

    render() {
      return (
        <ApolloProvider client={this.apollo}>
          <ComposedComponent {...this.props} />
        </ApolloProvider>
      );
    }
  };
};
