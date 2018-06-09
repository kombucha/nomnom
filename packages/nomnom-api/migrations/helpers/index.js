const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);

function generateSqlMigration(upFilePath) {
  const up = db => {
    const filePath = path.join(__dirname, "..", "sqls", upFilePath);
    return readFile(filePath, { encoding: "utf-8" }).then(data => db.runSql(data));
  };

  return {
    up,
    _meta: {
      version: 1
    }
  };
}

module.exports = { generateSqlMigration };
