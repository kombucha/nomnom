const readability = require("./index");

async function program() {
  const url = process.argv[2];
  const config = {
    imageFilePath: process.env.DATA_PATH,
    imageBaseUrl: "localhost"
  };

  try {
    const result = await readability(url, config);
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error(error);
  }
}

program();
