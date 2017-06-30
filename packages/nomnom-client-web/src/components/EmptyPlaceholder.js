import React from "react";
import styled from "styled-components";

const EmptyListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${props => props.theme.disabledColor};
`;
const EmptyListSmiley = styled.span`font-size: 10em;`;

export const EmptyPlaceholder = () =>
  <EmptyListContainer>
    <EmptyListSmiley>:(</EmptyListSmiley>
    <h2>No content to display</h2>
  </EmptyListContainer>;

export default EmptyPlaceholder;
