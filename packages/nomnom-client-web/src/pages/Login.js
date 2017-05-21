import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";

import authenticationService from "../services/authentication";
import PageTitle from "../components/PageTitle";
import withAuth from "../components/withAuth";

// See https://reacttraining.com/react-router/web/example/auth-workflow
class LoginPage extends Component {
  constructor() {
    super();
    this._handleLoginSucessful = this._handleLoginSucessful.bind(this);
  }

  _handleLoginSucessful({ code }) {
    return authenticationService.login(code).catch(e => {
      console.error("Failed to login", e);
    });
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { authenticated } = this.props;

    return authenticated
      ? <Redirect to={from} />
      : <div>
          <PageTitle value="Login" />
          <GoogleLogin
            clientId={authenticationService.GOOGLE_CLIENT_ID}
            buttonText="Log in with Google"
            offline
            onSuccess={this._handleLoginSucessful}
            onFailure={(...args) => console.log("error", args)}
          />
        </div>;
  }
}

export default withAuth(LoginPage);
