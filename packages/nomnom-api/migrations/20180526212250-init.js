const fs = require("fs");
const path = require("path");

const logger = require("../core/logger");

function up(db) {
  var filePath = path.join(__dirname, "sqls", "20180526212250-init-up.sql");
  return new Promise(function(resolve, reject) {
    fs.readFile(filePath, { encoding: "utf-8" }, function(err, data) {
      if (err) return reject(err);
      logger.info("received data: " + data);

      resolve(data);
    });
  }).then(function(data) {
    return db.runSql(data);
  });
}

module.exports = {
  up,
  _meta: { version: 1 }
};
