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

const shouldFetchField = (info, fieldName) =>
  info.fieldNodes[0].selectionSet.selections.some(selection => selection.name.value === fieldName);

module.exports = async (parentUser, { status, first = 10, after }, { user }, info) => {
  if (parentUser.id !== user.id) {
    return [];
  } else if (first < 1) {
    throw new Error(`Invalid first argument: ${first} (must be > 0)`);
  }

  let edges;
  let pageInfo;
  let totalCount;

  if (shouldFetchField(info, "totalCount")) {
    totalCount = await UserEntry.count(parentUser.id, status);
  }

  if (shouldFetchField(info, "edges") || shouldFetchField(info, "pageInfo")) {
    const limit = first + 1;
    const beforeCreationDate = after ? decodeCursor(after).creationDate : null;
    const userEntries = await UserEntry.list(parentUser.id, { status, limit, beforeCreationDate });

    edges = userEntries.slice(0, first).map(userEntry => ({
      node: userEntry,
      cursor: createCursor(status, userEntry)
    }));

    const hasNextPage = userEntries.length === limit;
    pageInfo = {
      hasPreviousPage: false,
      hasNextPage
    };
  }

  return {
    edges,
    pageInfo,
    totalCount
  };
};
