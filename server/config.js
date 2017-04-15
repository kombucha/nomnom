const path = require("path");

require("dotenv").config();

module.exports = {
  port: parseInt(process.env.PORT),
  couchbase: {
    url: process.env.COUCHBASE_URL,
    bucket: process.env.COUCHBASE_BUCKET
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl: process.env.GOOGLE_REDIRECT_URL || ""
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    algorithm: process.env.JWT_ALGORITHM
  },
  imagesPath: path.resolve(__dirname, "data/img/")
};
