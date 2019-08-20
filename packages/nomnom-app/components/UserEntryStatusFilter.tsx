import React from "react";
import styled from "@emotion/styled";
import numeral from "numeral";

import { UserEntryStatus } from "../apollo-types";
import { Menu, MenuItem } from "../toolkit/Menu";
import useUserEntriesCount from "../graphql/queries/userEntriesCount";
import { ThemeType } from "../toolkit/theme";

const StatusWrapper = styled.div`
  display: flex;
  min-width: 148px;
`;

const Label = styled.span`
  flex: 1;
`;

const Count = styled.span<{}, ThemeType>`
  color: ${props => props.theme.disabledColor};
`;

type UserEntryStatusFilterProps = {
  status: UserEntryStatus;
  onStatusChange: (status: UserEntryStatus) => void;
};

const UserEntryStatusFilter = ({ status, onStatusChange }: UserEntryStatusFilterProps) => {
  const statuses = useUserEntriesCount();

  return (
    <Menu<UserEntryStatus> value={status} onChange={onStatusChange}>
      {statuses.map(status => (
        <MenuItem key={status.value} value={status.value}>
          <StatusWrapper>
            <Label>{status.label}</Label>{" "}
            <Count>{numeral(status.totalCount).format("0.[0]a")}</Count>
          </StatusWrapper>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default UserEntryStatusFilter;
