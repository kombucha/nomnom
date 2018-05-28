const cheerio = require("cheerio");

const logger = require("../logger");
const handlers = require("./lib/handlers");
const { fixRelativeUrls, processImages, cacheImage, clean } = require("./lib/helpers");
const load = require("./lib/load");

const preProcessers = [fixRelativeUrls];
const postProcessers = [clean, processImages];

async function readability(url, config) {
  const response = await load(url);
  const htmlStr = String(response.body);

  let $html = cheerio.load(htmlStr, { useHtmlParser2: true })("html");

  // Common preprocessin
  for (const preProcess of preProcessers) {
    $html = await preProcess($html, url, config);
  }

  // Run readability scripts
  let result;
  for (const [handlerName, handler] of Object.entries(handlers)) {
    if (await handler.canHandle($html, url, config)) {
      logger.verbose(`Processing using ${handlerName} handler`);
      try {
        result = await handler.process($html, url, config);
        break;
      } catch (e) {
        logger.error(`${handlerName} failed to process content, skipping`);
        logger.error(e);
      }
    }
  }

  if (!result) {
    throw new Error("Parsing failed");
  }

  // Common post processing
  let postProcessedContent = result.content;
  for (const postProcess of postProcessers) {
    postProcessedContent = await postProcess(postProcessedContent, url, config);
  }

  if (result.imageUrl) {
    result.imageUrl = await cacheImage(result.imageUrl, config);
  }

  result.content = postProcessedContent.html();

  return result;
}

module.exports = readability;
