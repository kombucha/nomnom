import React from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { useApolloClient } from "@apollo/react-hooks";
import { ellipsis } from "polished";

import { User_me as User } from "../apollo-types";
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

type UserMenuProps = { user: User };

const UserMenu = ({ user }: UserMenuProps) => {
  const router = useRouter();
  const apolloClient = useApolloClient();

  return (
    <MenuContainer
      alignRight
      target={
        <MenuButton>
          <UserName>{user.name}</UserName>
          <Avatar size="30px" src={user.avatarUrl} alt={`${user.name}'s avatar`} />
        </MenuButton>
      }>
      <MenuItem onClick={() => router.push("/feeds")}>Feeds</MenuItem>
      <MenuItem onClick={() => router.push("/settings")}>Settings</MenuItem>
      <MenuItem onClick={() => logout(apolloClient)}>Sign out</MenuItem>
    </MenuContainer>
  );
};

export default UserMenu;
