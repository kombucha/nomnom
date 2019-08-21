import React, { useState } from "react";
import styled from "@emotion/styled";
import noop from "lodash/noop";

import Card from "../Card";
import { List, ListItem } from "../List";

export const MenuItem = styled(ListItem)<any>`
  cursor: pointer;
  font-size: 16px;
  line-height: 48px;
  min-height: 48px;
  padding: 0px 16px;

  color: ${props => (props.selected ? props.theme.accent1Color : props.theme.textColor)};
  background: none;
  white-space: nowrap;
  transition: background ${props => props.theme.transitionConfig};

  user-select: none;

  &:hover {
    background: rgba(0, 0, 0, 0.098);
  }
`;

type MenuProps<T extends string> = {
  value?: T;
  onChange?: (value: T) => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">;

export const Menu = <T extends string = string>({
  value = null,
  onChange = noop,
  children,
  ...rest
}: MenuProps<T>) => (
  <Card fullBleed {...rest}>
    <List>
      {React.Children.map(children, (menuItem: any) => {
        const newProps = {
          onClick: ev => {
            onChange(menuItem.props.value);
            if (menuItem.props.onClick) {
              menuItem.props.onClick(ev);
            }
          },
          selected: menuItem.props.value === value
        };

        return React.cloneElement(menuItem, newProps);
      })}
    </List>
  </Card>
);

const Overlay = styled.div`
  position: fixed;
  z-index: 10000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
const Container = styled.div`
  position: relative;
`;
const WrappedMenu = styled<typeof Menu, { alignRight: boolean }>(Menu)`
  position: absolute;
  top: 100%;
  ${props => (props.alignRight ? "right: 0;" : "left: 0;")} z-index: 10001;
`;

type MenuContainerProps = {
  target: React.ReactElement;
  alignRight?: boolean;
};

export const MenuContainer: React.FC<MenuContainerProps> = ({
  target,
  children: menuItems,
  alignRight = false
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const handleToggleMenu = () => setShowMenu(show => !show);

  const menuButton = React.cloneElement(target, { onClick: handleToggleMenu });

  return (
    <div>
      {showMenu ? <Overlay onClick={handleToggleMenu} /> : null}
      <Container>
        {menuButton}
        {showMenu ? (
          <WrappedMenu alignRight={alignRight} onClick={handleToggleMenu}>
            {menuItems}
          </WrappedMenu>
        ) : null}
      </Container>
    </div>
  );
};

export default Menu;
