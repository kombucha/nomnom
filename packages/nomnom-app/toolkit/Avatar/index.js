import React from "react";
import styled from "styled-components";

const AvatarImg = styled.img`
  width: ${props => props.size};
  height: ${props => props.size};
  border-radius: 50%;
`;

export const Avatar = ({ src, size = "40px", alt }) => (
  <AvatarImg src={src} size={size} alt={alt} />
);

export default Avatar;
