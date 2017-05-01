import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const CardWrapper = styled.section`
  background-color: white;
  border-radius: 2px;
  box-shadow: ${props => props.theme.shadow};
  padding: ${props => (props.fullBleed ? 0 : "16px")}
`;

export const Card = ({ children, ...rest }) => (
  <CardWrapper {...rest}>
    {children}
  </CardWrapper>
);

Card.propTypes = {
  fullBleed: PropTypes.bool
};
Card.defaultProps = {
  fullBleed: false
};

export const CardTitle = styled.h2`
  padding: 0;
  margin: 0;
  margin-bottom: 16px;
  font-weight: normal;
`;

export default Card;
