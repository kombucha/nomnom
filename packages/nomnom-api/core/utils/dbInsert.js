const dbPlaceholders = require("./dbPlaceholders");

function insert(tableName, data) {
  const columns = Object.keys(data)
    .map(key => `"${key}"`)
    .join(", ");
  const values = Object.values(data);

  return [
    `
    INSERT INTO "${tableName}"(${columns})
    VALUES (${dbPlaceholders(values.length)})
  `,
    values
  ];
}

module.exports = insert;
