import React from "react";

function asyncComponent(getComponent) {
  return class AsyncComponent extends React.Component {
    mounted = false;
    state = {
      Component: null
    };

    componentWillMount() {
      if (this.state.Component === null) {
        getComponent().then(module => {
          const Component = module.default;
          if (this.mounted) {
            this.setState({ Component });
          }
        });
      }
    }

    componentDidMount() {
      this.mounted = true;
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    render() {
      const { Component } = this.state;

      if (Component !== null) {
        return <Component {...this.props} />;
      }
      return null; // or <div /> with a loading spinner, etc..
    }
  };
}

export default asyncComponent;
