import React, { Component } from "react";
import authService from "../services/authentication";

function withAuth(WrappedComponent) {
  return class extends Component {
    constructor() {
      super();
      this.state = { authenticated: authService.isAuthenticated() };
      this._handleAuthChanged = this._handleAuthChanged.bind(this);
    }

    _handleAuthChanged(authenticated) {
      this.setState({ authenticated });
    }

    componentDidMount() {
      authService.addChangeListener(this._handleAuthChanged);
    }

    componentWillUnmount() {
      authService.removeChangeListener(this._handleAuthChanged);
    }

    render() {
      const { authenticated } = this.state;
      return <WrappedComponent {...this.props} authenticated={authenticated} />;
    }
  };
}

export default withAuth;
