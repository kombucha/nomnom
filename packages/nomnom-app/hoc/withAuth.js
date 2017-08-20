import React, { Component } from "react";
import checkLoggedIn from "../services/check-logged-in";
import redirect from "../services/redirect";

export default ComposedComponent => {
  return class WithAuth extends Component {
    static displayName = `WithAuth(${ComposedComponent.displayName})`;

    static async getInitialProps(context, apolloClient) {
      if (!apolloClient) {
        throw new Error("WithAuth must be used -after- WithData");
      }

      const loggedInUser = await checkLoggedIn(context, apolloClient);

      if (!loggedInUser) {
        // If not signed in, send them somewhere more useful
        redirect(context, "/login");
      }

      let composedInitialProps = {};
      if (ComposedComponent.getInitialProps) {
        composedInitialProps = await ComposedComponent.getInitialProps(context, apolloClient);
      }

      return {
        ...composedInitialProps,
        loggedInUser
      };
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  };
};
