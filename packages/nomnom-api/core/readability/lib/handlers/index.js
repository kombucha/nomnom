const fs = require("fs");

const handlers = fs
  .readdirSync(__dirname)
  .filter(m => m !== "index.js")
  .sort(a => (a === "generic.js" ? 1 : 0))
  .reduce((acc, m) => {
    const name = m.slice(0, m.lastIndexOf("."));
    acc[name] = require(`./${name}`);
    return acc;
  }, {});

module.exports = handlers;
