import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Avatar from "material-ui/Avatar";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import FlatButton from "material-ui/FlatButton";
import { gql, graphql } from "react-apollo";

import withAuth from "./withAuth";
import authService from "../services/authentication";

const STYLES = {
  icon: {
    color: "white"
  }
};

// A FlatButton that can be placed in lieu of an IconButton (ie. without iconStyle warning)
const FlatIconButton = ({ iconStyle, ...rest }) => <FlatButton {...rest} />;

export class UserMenu extends Component {
  constructor() {
    super();
    this._goToSettings = this._goToSettings.bind(this);
  }

  _logout() {
    authService.logout();
  }

  _goToSettings() {
    this.props.history.push("/settings");
  }

  render() {
    const { data, authenticated } = this.props;
    const showMenu = authenticated && data && data.me;

    if (!showMenu) {
      return null;
    }

    return (
      <IconMenu
        iconButtonElement={
          <FlatIconButton
            style={{ color: "white" }}
            label={data.me.name}
            labelPosition="before"
            icon={<Avatar src={data.me.avatarUrl} size={30} />}
          />
        }
        iconStyle={STYLES.icon}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        targetOrigin={{ horizontal: "right", vertical: "bottom" }}>
        <MenuItem primaryText="Settings" onTouchTap={this._goToSettings} />
        <MenuItem primaryText="Send feedback" />
        <MenuItem primaryText="Sign out" onTouchTap={this._logout} />
      </IconMenu>
    );
  }
}

const withGraphql = graphql(gql`query { me { name avatarUrl } }`, {
  skip: props => !props.authenticated
});
const UserMenuWithEverything = withRouter(withAuth(withGraphql(UserMenu)));

export default UserMenuWithEverything;
