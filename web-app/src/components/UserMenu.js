import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { gql, graphql } from "react-apollo";
import styled from "styled-components";

import { truncate } from "../style-utils";
import authService from "../services/authentication";
import withAuth from "./withAuth";
import { MenuContainer, MenuItem } from "./Menu";
import FlatButton from "./FlatButton";
import Avatar from "./Avatar";

const MenuButton = styled(FlatButton)`color: white;`;
const UserName = styled.span`
  ${truncate("160px")}
  padding-right: 8px;
`;

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
      <MenuContainer
        alignRight
        target={
          <MenuButton>
            <UserName>{data.me.name}</UserName>
            <Avatar size="30px" src={data.me.avatarUrl} />
          </MenuButton>
        }>
        <MenuItem onClick={this._goToSettings}>Settings</MenuItem>
        <MenuItem>Send feedback</MenuItem>
        <MenuItem onClick={this._logout}>Sign out</MenuItem>
      </MenuContainer>
    );
  }
}

const withGraphql = graphql(gql`query { me { name avatarUrl } }`, {
  skip: props => !props.authenticated
});
const UserMenuWithEverything = withRouter(withAuth(withGraphql(UserMenu)));

export default UserMenuWithEverything;
