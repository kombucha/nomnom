import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import DeleteIcon from "react-icons/lib/md/cancel";

const ChipWrapper = styled.div`
    display: inline-block;
    margin: 4px;
    width: fit-content;

    cursor: pointer;
    text-decoration: none;
    font-size: inherit;
    font-weight: inherit;
    background-color: rgb(224, 224, 224);
    border-radius: 16px;
    white-space: nowrap;

    &:hover {
      background-color: rgb(206, 206, 206);
    }
`;

const ChipContent = styled.span`
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.87);
  font-size: 14px;
  font-weight: 400;
  line-height: 32px;
  padding: 0px 12px;
  user-select: none;
  white-space: nowrap;
`;

const ChipText = styled.span`
  &:not(::last-child) {
    margin-right: 4px;
  }
`;

const StyledDeleteIcon = styled(DeleteIcon)`
  color: rgba(0, 0, 0, 0.258) !important;
  fill: rgba(0, 0, 0, 0.258) !important;
  cursor: pointer;
  margin-right: -8px;

  &:hover {
    color: rgba(0, 0, 0, 0.4) !important;
    fill: rgba(0, 0, 0, 0.4) !important;
  }
`;

export const Chip = ({ children, onClick, onRequestDelete }) => (
  <ChipWrapper onClick={onClick}>
    <ChipContent>
      <ChipText>{React.Children.toArray(children)}</ChipText>
      {onRequestDelete ? <StyledDeleteIcon className="icon" onClick={onRequestDelete} /> : null}
    </ChipContent>
  </ChipWrapper>
);

Chip.propTypes = {
  onClick: PropTypes.func,
  onRequestDelete: PropTypes.func
};

export default Chip;
