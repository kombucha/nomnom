import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

const spacing = "16px";
const CardWrapper = styled.section`
  background-color: white;
  border-radius: 2px;
  box-shadow: ${props => props.theme.shadow};
  padding: ${props => (props.fullBleed ? 0 : spacing)};
  overflow: hidden;
`;

export const Card = ({ children, ...rest }) => <CardWrapper {...rest}>{children}</CardWrapper>;

Card.propTypes = {
  fullBleed: PropTypes.bool
};
Card.defaultProps = {
  fullBleed: false
};

export const CardTitle = styled.h2`
  padding: 0;
  margin: 0;
  margin-bottom: ${spacing};
  font-weight: normal;
`;
CardTitle.displayName = "CardTitle";

export default Card;
