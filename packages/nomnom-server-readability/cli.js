const readability = require("./index");

async function program() {
  const url = process.argv[2];
  const config = {
    imageFilePath: "/Users/vincentlemeunier/Desktop",
    imageBaseUrl: ""
  };
  const result = await readability(url, config);

  console.log(JSON.stringify(result));
}

program();
