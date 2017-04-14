const DataLoader = require("dataloader");
const db = require("../services/couchbase");

function mapToArray(map) {
  return Object.keys(map).reduce(
    (acc, id) => {
      acc.push(Object.assign({ id }, map[id].value));
      return acc;
    },
    []
  );
}

async function batchLoadFn(ids) {
  const data = await db.getMulti(ids);
  return mapToArray(data);
}

module.exports = () => ({
  genericLoader: new DataLoader(batchLoadFn)
});
