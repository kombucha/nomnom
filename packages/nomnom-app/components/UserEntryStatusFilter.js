import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import numeral from "numeral";

import { Menu, MenuItem } from "../toolkit/Menu";
import userEntriesCountContainer from "../graphql/queries/userEntriesCount";

const StatusWrapper = styled.div`
  display: flex;
  min-width: 148px;
`;

const Label = styled.span`
  flex: 1;
`;

const Count = styled.span`
  color: ${props => props.theme.disabledColor};
`;

export class UserEntryStatusFilter extends React.PureComponent {
  static propTypes = {
    statuses: PropTypes.array.isRequired,
    status: PropTypes.string.isRequired,
    onStatusChange: PropTypes.func.isRequired
  };

  render() {
    const { statuses, status, onStatusChange } = this.props;
    return (
      <Menu value={status} onChange={onStatusChange}>
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
  }
}

export const ConnectedUserEntryStatusFilter = userEntriesCountContainer(UserEntryStatusFilter);

export default ConnectedUserEntryStatusFilter;
