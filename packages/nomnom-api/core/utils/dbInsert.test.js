const insert = require("./dbInsert");

it("should respect the number of values", () => {
  const [_, values] = insert("TableName", { something: true, else: 2 });
  expect(values.length).toBe(2);
});

it("should not change output", () => {
  const result = insert("TableName", { something: true });
  expect(result).toMatchSnapshot();
});
