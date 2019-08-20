import React, { Component } from "react";
import checkLoggedIn from "../../services/checkLoggedIn";
import redirect from "../../services/redirect";

export default ComposedComponent => {
  return class WithAuth extends Component {
    static displayName = `WithAuth(${ComposedComponent.displayName})`;

    static async getInitialProps(context) {
      if (!context.apolloClient) {
        throw new Error("WithAuth must be used -after- WithApollo");
      }

      let loggedInUser;

      try {
        loggedInUser = await checkLoggedIn(context);
      } catch (err) {
        console.log(err);
      }

      if (!loggedInUser) {
        // If not signed in, send them somewhere more useful
        redirect(context, "/login");
      }

      let composedInitialProps = {};
      if (ComposedComponent.getInitialProps) {
        composedInitialProps = await ComposedComponent.getInitialProps(context);
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
