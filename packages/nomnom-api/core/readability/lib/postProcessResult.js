const cheerio = require("cheerio");
const { processImages, cacheImage, clean } = require("./helpers");

const postProcessors = [clean, processImages];

async function postProcessResult(result, url, config) {
  const processedResult = { ...result };

  if (processedResult.content) {
    let content =
      typeof processedResult.content === "string"
        ? cheerio.load(processedResult.content)
        : processedResult.content;

    for (const postProcess of postProcessors) {
      content = await postProcess(content, url, config);
    }
    processedResult.content = content.html();
  } else {
    processedResult.content = undefined;
  }

  if (processedResult.imageUrl) {
    processedResult.imageUrl = await cacheImage(processedResult.imageUrl, config);
  } else {
    processedResult.imageUrl = undefined;
  }

  return processedResult;
}

module.exports = postProcessResult;
