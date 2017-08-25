import React, { PureComponent } from "react";
import { withApollo } from "react-apollo";
import { compose } from "recompose";
import GoogleLogin from "react-google-login";
import cookie from "cookie";

import PageWrapper from "../components/PageWrapper";
import PageTitle from "../components/PageTitle";
import withData from "../hoc/withData";
import checkLoggedIn from "../services/check-logged-in";
import redirect from "../services/redirect";

const GOOGLE_CLIENT_ID = "388702499328-ld8l7lj9kggb3nfs53aoq7k651udla6u.apps.googleusercontent.com";
const THIRTY_DAYS = 30 * 24 * 60 * 60;

class LoginPage extends PureComponent {
  static async getInitialProps(context, apolloClient) {
    const loggedInUser = await checkLoggedIn(context, apolloClient);

    if (loggedInUser) {
      redirect(context, "/");
    }

    return {};
  }

  _handleLoginSucessful = ({ code }) => {
    const { client } = this.props;
    return fetch("http://localhost:4001/login/google", {
      method: "POST",
      body: code
    })
      .then(r => (r.ok ? r.text() : Promise.reject("Fail !")))
      .then(token => {
        document.cookie = cookie.serialize("token", token, { maxAge: THIRTY_DAYS });
        return client.resetStore();
      })
      .then(() => redirect({}, "/"));
  };

  _handleLoginFail = (...args) => {
    console.log("error", args);
  };

  render() {
    // const { from } = this.props.url.query.from || { from: { pathname: "/" } };
    // const { authenticated } = this.props;

    return (
      <PageWrapper>
        <PageTitle value="Login" />
        <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          buttonText="Log in with Google"
          responseType="code"
          onSuccess={this._handleLoginSucessful}
          onFailure={this._handleLoginFail}
        />
      </PageWrapper>
    );
  }
}

export default compose(withData, withApollo)(LoginPage);
