import React, { Component } from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import { compose, withProps } from "recompose";
import styled from "styled-components";
import { ellipsis } from "polished";

import authService from "../services/authentication";
import withAuth from "./withAuth";
import { MenuContainer, MenuItem } from "../toolkit/Menu";
import FlatButton from "../toolkit/FlatButton";
import Avatar from "../toolkit/Avatar";

import userContainer from "../graphql/queries/user";

const MenuButton = styled(FlatButton)`color: white;`;
const UserName = styled.span`${ellipsis("160px")} padding-right: 8px;`;

export class UserMenu extends Component {
  constructor() {
    super();
    this._goToSettings = this._goToSettings.bind(this);
    this._goToFeeds = this._goToFeeds.bind(this);
  }

  _logout() {
    authService.logout();
  }

  _goToSettings() {
    this.props.pushState("/settings");
  }

  _goToFeeds() {
    this.props.pushState("/feeds");
  }

  render() {
    const { user, authenticated } = this.props;
    const showMenu = authenticated && user;

    if (!showMenu) {
      return null;
    }

    return showMenu
      ? <MenuContainer
          alignRight
          target={
            <MenuButton>
              <UserName>
                {user.name}
              </UserName>
              <Avatar size="30px" src={user.avatarUrl} />
            </MenuButton>
          }>
          <MenuItem onClick={this._goToFeeds}>Feeds</MenuItem>
          <MenuItem onClick={this._goToSettings}>Settings</MenuItem>
          <MenuItem onClick={this._logout}>Sign out</MenuItem>
        </MenuContainer>
      : null;
  }
}

UserMenu.propTypes = {
  user: PropTypes.object,
  pushState: PropTypes.func.isRequired
};

export default compose(withAuth, userContainer, withProps({ pushState: Router.push }))(UserMenu);
