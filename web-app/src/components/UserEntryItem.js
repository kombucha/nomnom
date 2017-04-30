import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Avatar from "./Avatar";

const UserEntryLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 16px 16px;
  text-decoration: none;
  color: inherit;

  &:hover {
    background-color: rgba(0, 0, 0, 0.098);
  }
`;
const UserEntryTextContainer = styled.p`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 0;
  margin-left: 16px;
`;

const UserEntrySubtitle = styled.span`
  font-size: 14px;
  line-height: 16px;
  height: 16px;

  color: rgba(0, 0, 0, 0.54);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const renderSecondaryText = userEntry => {
  const tagsCount = userEntry.tags.length;
  const tags = tagsCount > 0
    ? <span>
        {" | "}
        {userEntry.tags.map((tag, idx) => (
          <span key={tag}>{`${tag}${idx < tagsCount - 1 ? ", " : ""}`}</span>
        ))}
      </span>
    : null;
  return <UserEntrySubtitle>{userEntry.domain}{tags}</UserEntrySubtitle>;
};

export const UserEntryItem = ({ userEntry }) => (
  <UserEntryLink key={userEntry.id} to={`/entries/${userEntry.id}`}>
    <Avatar src={userEntry.imageUrl} />
    <UserEntryTextContainer>
      <span>{userEntry.title}</span>
      {renderSecondaryText(userEntry)}
    </UserEntryTextContainer>
  </UserEntryLink>
);

// Placeholder
const UserEntryPlaceholderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 16px;
`;
const PlaceHolderElement = styled.span`
  background: #eeeeee;
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
  title: { width: "80%" },
  subtitle: { width: "50%" }
};

export const UserEntryItemPlaceholder = () => (
  <UserEntryPlaceholderContainer>
    <FakeAvatar />
    <UserEntryTextContainer>
      <PlaceHolderElement style={placeholderStyles.title} />
      <PlaceHolderElement style={placeholderStyles.subtitle} />
    </UserEntryTextContainer>
  </UserEntryPlaceholderContainer>
);

export default UserEntryItem;
