import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import { withProps } from "recompose";
import styled from "styled-components";
import { ellipsis } from "polished";

import logout from "../services/logout";
import { MenuContainer, MenuItem } from "../toolkit/Menu";
import FlatButton from "../toolkit/FlatButton";
import Avatar from "../toolkit/Avatar";

const MenuButton = styled(FlatButton)`color: white;`;
const UserName = styled.span`${ellipsis("160px")} padding-right: 8px;`;

export class UserMenu extends PureComponent {
  _logout = logout;
  _goToSettings = () => this.props.pushState("/settings");
  _goToFeeds = () => this.props.pushState("/feeds");

  render() {
    const { user } = this.props;

    return (
      <MenuContainer
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
    );
  }
}

UserMenu.propTypes = {
  user: PropTypes.object.isRequired,
  pushState: PropTypes.func.isRequired
};

export default withProps({ pushState: Router.push })(UserMenu);
