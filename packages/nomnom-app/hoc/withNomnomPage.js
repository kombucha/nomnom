import { PureComponent } from "react";
import { compose } from "recompose";
import withData from "./withData";
import withAuth from "./withAuth";

import PageWrapper from "../components/PageWrapper";

const composer = compose(withData, withAuth);

export default ComposedComponent => {
  return class WithNomNomPage extends PureComponent {
    static displayName = `NomNomPage(${ComposedComponent.displayName})`;
    render() {
      return (
        <PageWrapper loggedInUser={this.props.loggedInUser}>
          <ComposedComponent {...this.props} />
        </PageWrapper>
      );
    }
  };
};
