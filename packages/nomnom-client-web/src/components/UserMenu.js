import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { gql, graphql } from "react-apollo";
import styled from "styled-components";
import { ellipsis } from "polished";

import authService from "../services/authentication";
import withAuth from "./withAuth";
import { MenuContainer, MenuItem } from "nomnom-components/lib/Menu";
import FlatButton from "nomnom-components/lib/FlatButton";
import Avatar from "nomnom-components/lib/Avatar";

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
    this.props.history.push("/settings");
  }

  _goToFeeds() {
    this.props.history.push("/feeds");
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
            <UserName>
              {data.me.name}
            </UserName>
            <Avatar size="30px" src={data.me.avatarUrl} />
          </MenuButton>
        }>
        <MenuItem onClick={this._goToFeeds}>Feeds</MenuItem>
        <MenuItem onClick={this._goToSettings}>Settings</MenuItem>
        <MenuItem onClick={this._logout}>Sign out</MenuItem>
      </MenuContainer>
    );
  }
}

const withGraphql = graphql(
  gql`
    query {
      me {
        name
        avatarUrl
      }
    }
  `,
  {
    skip: props => !props.authenticated
  }
);

export default compose(withRouter, withAuth, withGraphql)(UserMenu);
