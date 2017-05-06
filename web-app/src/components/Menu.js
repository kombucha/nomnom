import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Card from "./Card";
import { List, ListItem } from "./List";

export const MenuItem = styled(ListItem)`
  cursor: pointer;
  font-size: 16px;
  line-height: 48px;
  min-height: 48px;
  padding: 0px 16px;

  color: ${props => (props.selected ? props.theme.accent1Color : props.theme.textColor)};
  background: none;
  white-space: nowrap;
  transition: background ${props => props.theme.transitionConfig};

  &:hover {
    background: rgba(0, 0, 0, 0.098);
  }
`;

export const Menu = ({ children, value, onChange, ...rest }) => (
  <Card fullBleed {...rest}>
    <List>
      {React.Children.map(children, menuItem => {
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

Menu.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf([MenuItem])
    })
  ),
  onChange: PropTypes.func
};
Menu.defaultProps = {
  value: null,
  onChange: () => {}
};

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
const WrappedMenu = styled(Menu)`
  position: absolute;
  top: 100%;
  ${props => (props.alignRight ? "right: 0;" : "left: 0;")}
  z-index: 10001;
`;

export class MenuContainer extends Component {
  constructor() {
    super();
    this.state = { showMenu: false };
    this._toggleMenu = this._toggleMenu.bind(this);
  }

  _toggleMenu() {
    this.setState(state => ({ showMenu: !state.showMenu }));
  }

  render() {
    const { target, children: menuItems, alignRight } = this.props;
    const { showMenu } = this.state;
    const menuButton = React.cloneElement(target, {
      onClick: this._toggleMenu
    });

    return (
      <div>
        {showMenu ? <Overlay onClick={this._toggleMenu} /> : null}
        <Container>
          {menuButton}
          {showMenu
            ? <WrappedMenu alignRight={alignRight} onClick={this._toggleMenu}>
                {menuItems}
              </WrappedMenu>
            : null}
        </Container>
      </div>
    );
  }
}

export default Menu;
