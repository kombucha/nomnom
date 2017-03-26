const DataLoader = require("dataloader");
const db = require("../couchbase");

function mapToArray(map) {
  return Object.keys(map).reduce(
    (acc, id) => {
      acc.push(Object.assign({ id }, map[id].value));
      return acc;
    },
    []
  );
}

module.exports = () => ({
  genericLoader: new DataLoader(ids => db.getMulti(ids).then(mapToArray))
});
