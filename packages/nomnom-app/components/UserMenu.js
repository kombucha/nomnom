import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ApolloConsumer } from "@apollo/react-common";
import { withRouter } from "next/router";
import styled from "@emotion/styled";
import { ellipsis } from "polished";

import logout from "../services/logout";
import { MenuContainer, MenuItem } from "../toolkit/Menu";
import FlatButton from "../toolkit/FlatButton";
import Avatar from "../toolkit/Avatar";

const MenuButton = styled(FlatButton)`
  color: white;
`;
const UserName = styled.span`
  ${ellipsis("160px")} padding-right: 8px;
`;

export class UserMenu extends PureComponent {
  _logout = apolloClient => () => logout(apolloClient);
  _goToSettings = () => this.props.router.push("/settings");
  _goToFeeds = () => this.props.router.push("/feeds");

  render() {
    const { user } = this.props;

    return (
      <ApolloConsumer>
        {apolloClient => (
          <MenuContainer
            alignRight
            target={
              <MenuButton>
                <UserName>{user.name}</UserName>
                <Avatar size="30px" src={user.avatarUrl} alt={`${user.name}'s avatar`} />
              </MenuButton>
            }>
            <MenuItem onClick={this._goToFeeds}>Feeds</MenuItem>
            <MenuItem onClick={this._goToSettings}>Settings</MenuItem>
            <MenuItem onClick={this._logout(apolloClient)}>Sign out</MenuItem>
          </MenuContainer>
        )}
      </ApolloConsumer>
    );
  }
}

UserMenu.propTypes = {
  user: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired
};

export default withRouter(UserMenu);
