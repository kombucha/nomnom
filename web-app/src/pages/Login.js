import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";
import authenticationService from "../services/authentication";

// See https://reacttraining.com/react-router/web/example/auth-workflow
class LoginPage extends Component {
  constructor() {
    super();
    this.state = { redirectToReferrer: false };
    this._handleLoginSucessful = this._handleLoginSucessful.bind(this);
  }

  _handleLoginSucessful({ code }) {
    return authenticationService
      .login(code)
      .then(token => {
        this.setState({ redirectToReferrer: true });
      })
      .catch(e => {
        console.error("Failed to login", e);
      });
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    return redirectToReferrer
      ? <Redirect to={from} />
      : <div>
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

export default LoginPage;
