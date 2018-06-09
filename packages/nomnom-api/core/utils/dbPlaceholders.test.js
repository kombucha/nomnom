const dbPlaceholders = require("./dbPlaceholders");

it("should return the correct number of placeholders", () => {
  const result = dbPlaceholders(3);
  expect(result).toBe("$1, $2, $3");
});

it("should return handle offsets", () => {
  const result = dbPlaceholders(3, 4);
  expect(result).toBe("$4, $5, $6");
});
