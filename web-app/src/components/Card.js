import React from "react";
import styled from "styled-components";

const CardWrapper = styled.section`
  background-color: white;
  border-radius: 2px;
  box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px;
  padding: ${props => (props.fullBleed ? 0 : "16px")}
`;

export const Card = ({ children, ...rest }) => (
  <CardWrapper {...rest}>
    {children}
  </CardWrapper>
);

export const CardTitle = styled.h2`
  padding: 0;
  margin: 0;
  margin-bottom: 16px;
  font-weight: normal;
`;

export default Card;
