const range = require("lodash/range");

const dbPlaceholders = (count, startIdx = 1) =>
  range(startIdx, startIdx + count)
    .map(val => `$${val}`)
    .join(", ");

module.exports = dbPlaceholders;
