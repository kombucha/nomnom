import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { lighten } from "polished";
import UncheckedIcon from "react-icons/lib/md/check-box-outline-blank";
import CheckedIcon from "react-icons/lib/md/check-box";

import Avatar from "../toolkit/Avatar";

// ListItem
export const LIST_ITEM_HEIGHT = 72;
const IMAGE_SIZE = 40;
const CELL_SPACING = 16;
const ListItemContainer = styled.div`
  height: ${LIST_ITEM_HEIGHT}px;
  margin: 0;
  padding: ${CELL_SPACING}px;

  display: flex;
  align-items: center;

  text-decoration: none;
  color: inherit;
  transition: background-color ${props => props.theme.transitionConfig};
`;

const ListItemTextContainer = styled.p`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 0;
  margin-left: ${CELL_SPACING}px;
`;

const ListItemTitle = styled.span``;

const ListItemSubtitle = styled.span`
  font-size: 14px;
  line-height: 16px;
  height: 16px;

  color: rgba(0, 0, 0, 0.54);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ListItem = ({ imageUrl, title, subtitle }) =>
  <ListItemContainer>
    <Avatar src={imageUrl} size={`${IMAGE_SIZE}px`} />
    <ListItemTextContainer>
      <ListItemTitle>
        {title}
      </ListItemTitle>
      <ListItemSubtitle>
        {subtitle}
      </ListItemSubtitle>
    </ListItemTextContainer>
  </ListItemContainer>;

ListItem.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string
};

ListItem.defaultProps = {
  selected: false
};

// RichListItem
const richListItemBackgroundColor = props =>
  props.selected ? lighten(0.45, props.theme.primary1Color) : "white";
const RichListItemContainer = styled.div`
  position: relative;
  cursor: pointer;
  background-color: ${richListItemBackgroundColor};
`;
const RichListItemActionsContainer = styled.div`
  position: absolute;
  top: 0;
  right: ${CELL_SPACING}px;
  height: 100%;

  display: flex;
  align-items: center;
`;
const CheckboxContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${2 * CELL_SPACING + IMAGE_SIZE}px;
  height: ${2 * CELL_SPACING + IMAGE_SIZE}px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  background-color: ${richListItemBackgroundColor};
  opacity: ${props => (props.shown ? "1" : "0")};
`;

export class RichListItem extends PureComponent {
  state = { showActions: false, overSelector: false };

  _handleCheckboxClicked = ev => {
    const { onClick, selected } = this.props;
    ev.stopPropagation();
    ev.preventDefault();
    onClick(ev, true, selected);
  };
  _handleItemEnter = () => this.setState({ showActions: true });
  _handleItemOut = () => this.setState({ showActions: false });
  _handleCheckboxEnter = () => this.setState({ overSelector: true });
  _handleCheckboxOut = () => this.setState({ overSelector: false });

  render() {
    const {
      imageUrl,
      title,
      subtitle,
      actions,
      selected,
      selectable,
      selectMode,
      onClick
    } = this.props;
    const { showActions, overSelector } = this.state;
    const shouldShowSelector = selected || overSelector || selectMode;
    const shouldShowActions = !selected && showActions;
    const isSelectionMode = selectable && selected;

    return (
      <RichListItemContainer
        selected={selected}
        onClick={ev => onClick(ev, isSelectionMode, selected)}
        onMouseEnter={this._handleItemEnter}
        onMouseLeave={this._handleItemOut}>
        <ListItem imageUrl={imageUrl} title={title} subtitle={subtitle} />

        {/* Select state */}
        {selectable &&
          <CheckboxContainer
            shown={shouldShowSelector}
            selected={selected}
            onMouseEnter={this._handleCheckboxEnter}
            onMouseLeave={this._handleCheckboxOut}
            onClick={this._handleCheckboxClicked}>
            {selected ? <CheckedIcon className="icon" /> : <UncheckedIcon className="icon" />}
          </CheckboxContainer>}

        {/* Actions */}
        {shouldShowActions &&
          <RichListItemActionsContainer>
            {React.Children.toArray(actions)}
          </RichListItemActionsContainer>}
      </RichListItemContainer>
    );
  }
}

RichListItem.propTypes = Object.assign({}, ListItem.propTypes, {
  selected: PropTypes.bool.isRequired,
  selectable: PropTypes.bool.isRequired,
  selectMode: PropTypes.bool.isRequired,
  actions: PropTypes.array,
  onClick: PropTypes.func
});

RichListItem.defaultProps = Object.assign({}, ListItem.defaultProps, {
  selectable: true,
  selectMode: false,
  selected: false,
  onClick: (ev, isSelectionMode, isSelected) => {
    console.log(`SelectionMode ${isSelectionMode}, Selected ${isSelected}`);
  }
});

// Placeholder
const ListItemPlaceholderContainer = styled.li`
  display: flex;
  align-items: center;
  padding: ${CELL_SPACING}px;
`;
const PlaceHolderElement = styled.span`
  background: #eee;
  &::after {
    content: '.';
    display: block;
    visibility: hidden;
  }
`;
const FakeAvatar = styled(PlaceHolderElement)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;
const placeholderStyles = {
  title: { width: "50%" },
  subtitle: { width: "30%" }
};

export const ListItemPlaceholder = () =>
  <ListItemPlaceholderContainer>
    <FakeAvatar />
    <ListItemTextContainer>
      <PlaceHolderElement style={placeholderStyles.title} />
      <PlaceHolderElement style={placeholderStyles.subtitle} />
    </ListItemTextContainer>
  </ListItemPlaceholderContainer>;

export default ListItem;
