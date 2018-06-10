function updateOne(tableName, id, data) {
  let updates = [];
  let values = [id];
  let idx = 2;

  for (let [column, value] of Object.entries(data)) {
    updates.push(`"${column}" = $${idx++}`);
    values.push(value);
  }

  return [
    `
    UPDATE "${tableName}"
    SET ${updates.join(", ")}
    WHERE "id" = $1
    RETURNING "${tableName}".*;
  `,
    values
  ];
}

module.exports = { updateOne };
