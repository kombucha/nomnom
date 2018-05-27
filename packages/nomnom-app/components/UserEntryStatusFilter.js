import React from "react";
import PropTypes from "prop-types";

import { Menu, MenuItem } from "../toolkit/Menu";
import userEntriesCountContainer from "../graphql/queries/userEntriesCount";

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
            {status.label} ({status.totalCount})
          </MenuItem>
        ))}
      </Menu>
    );
  }
}

export const ConnectedUserEntryStatusFilter = userEntriesCountContainer(UserEntryStatusFilter);

export default ConnectedUserEntryStatusFilter;
