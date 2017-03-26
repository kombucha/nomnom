module.exports = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 4000,
  couchbase: {
    url: process.env.COUCHBASE_URL || "couchbase://127.0.0.1",
    bucket: process.env.COUCHBASE_BUCKET || "nomnom"
  }
};
