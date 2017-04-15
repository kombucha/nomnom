import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";

const CLIENT_ID = "388702499328-ld8l7lj9kggb3nfs53aoq7k651udla6u.apps.googleusercontent.com";

// See https://reacttraining.com/react-router/web/example/auth-workflow
class LoginPage extends Component {
  constructor() {
    super();
    this.state = { redirectToReferrer: false };
    this._handleLoginSucessful = this._handleLoginSucessful.bind(this);
  }

  _handleLoginSucessful({ code }) {
    return fetch("/login/google", { method: "POST", body: code })
      .then(r => r.ok ? r.text() : Promise.reject("Fail !"))
      .then(token => {
        localStorage.setItem("token", token);
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
            clientId={CLIENT_ID}
            buttonText="Log in with Google"
            offline
            onSuccess={this._handleLoginSucessful}
            onFailure={(...args) => console.log("error", args)}
          />
        </div>;
  }
}

export default LoginPage;
