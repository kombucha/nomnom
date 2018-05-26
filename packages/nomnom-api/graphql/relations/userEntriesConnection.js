const UserEntry = require("../../core/userEntry");

const base64encode = str => Buffer.from(str).toString("base64");
const base64decode = str => Buffer.from(str, "base64").toString();

const createCursor = (status, userEntry) =>
  base64encode(`${status}-${userEntry.creationDate.getTime()}`);
const decodeCursor = cursor => {
  const str = base64decode(cursor);
  const parts = str.split("-");

  return {
    status: parts[0],
    creationDate: new Date(parseInt(parts[1], 10))
  };
};

module.exports = async (parentUser, { status, first = 10, after }, { user }) => {
  if (parentUser.id !== user.id) {
    return [];
  } else if (first < 1) {
    throw new Error(`Invalid first argument: ${first} (must be > 0)`);
  }

  const limit = first + 1;
  const beforeCreationDate = after ? decodeCursor(after).creationDate : null;
  const userEntries = await UserEntry.list(parentUser.id, { status, limit, beforeCreationDate });

  const edges = userEntries.slice(0, first).map(userEntry => ({
    node: userEntry,
    cursor: createCursor(status, userEntry)
  }));

  const hasNextPage = userEntries.length === limit;
  const pageInfo = {
    hasPreviousPage: false,
    hasNextPage
  };

  return {
    edges,
    pageInfo
  };
};
