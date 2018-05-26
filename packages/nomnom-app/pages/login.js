import React, { PureComponent } from "react";
import getConfig from "next/config";
import GoogleLogin from "react-google-login";
import cookie from "cookie";

import PageWrapper from "../components/PageWrapper";
import PageTitle from "../components/PageTitle";
import checkLoggedIn from "../services/checkLoggedIn";
import redirect from "../services/redirect";

const {
  publicRuntimeConfig: { apiUrl, googleClientId }
} = getConfig();

const THIRTY_DAYS = 30 * 24 * 60 * 60;

class LoginPage extends PureComponent {
  static async getInitialProps(context) {
    const loggedInUser = await checkLoggedIn(context);

    if (loggedInUser) {
      redirect(context, "/");
    }

    return {};
  }

  _handleLoginSucessful = ({ code }) => {
    const { apolloClient } = this.props;

    return fetch(`${apiUrl}/login/google`, {
      method: "POST",
      body: code
    })
      .then(r => (r.ok ? r.text() : Promise.reject("Fail !")))
      .then(token => {
        document.cookie = cookie.serialize("token", token, {
          maxAge: THIRTY_DAYS
        });
        return apolloClient.resetStore();
      })
      .then(() => redirect({}, "/"));
  };

  _handleLoginFail = (...args) => {
    console.log("error", args);
  };

  render() {
    return (
      <PageWrapper>
        <PageTitle value="Login" />
        <GoogleLogin
          clientId={googleClientId}
          buttonText="Log in with Google"
          responseType="code"
          onSuccess={this._handleLoginSucessful}
          onFailure={this._handleLoginFail}
        />
      </PageWrapper>
    );
  }
}

export default LoginPage;
