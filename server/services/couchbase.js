// TODO: Probably a bad choice, should probably move to postgre...

const couchbase = require("couchbase");
const logger = require("./logger");
const config = require("../config");
const promisify = require("../utils/promisify");

logger.info(
  `Connecting to bucket ${config.couchbase.bucket} on ${config.couchbase.url}`
);
const cluster = new couchbase.Cluster(config.couchbase.url);
const bucket = cluster.openBucket(config.couchbase.bucket);

// Yeww but no callbacks >:(
function promisifyBucket(bucket) {
  const fns = [
    "query",
    "get",
    "getMulti",
    "getAndTouch",
    "getAndLock",
    "getReplica",
    "touch",
    "unlock",
    "remove",
    "upsert",
    "insert",
    "replace",
    "append",
    "prepend",
    "counter",
    "mapGet",
    "mapRemove",
    "mapSize",
    "mapAdd",
    "listGet",
    "listPush",
    "listShift",
    "listRemove",
    "listSet",
    "listSize",
    "setAdd",
    "setExists",
    "setSize",
    "setRemove"
  ];

  fns.forEach(fnName => {
    bucket[fnName] = promisify(bucket[fnName], bucket);
  });

  const mutateIn = bucket.mutateIn.bind(bucket);

  bucket.mutateIn = function(key, options) {
    const builder = mutateIn(key, options);
    builder.execute = promisify(builder.execute, builder);
    return builder;
  };

  return bucket;
}

module.exports = promisifyBucket(bucket);
