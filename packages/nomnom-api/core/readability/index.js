const cheerio = require("cheerio");

const logger = require("../logger");
const handlers = require("./lib/handlers");
const load = require("./lib/load");
const preProcessHtml = require("./lib/preProcessHtml");
const postProcessResult = require("./lib/postProcessResult");

async function readability(url, config) {
  const response = await load(url);
  const htmlStr = String(response.body);

  let $html = cheerio.load(htmlStr, { useHtmlParser2: true }).root();

  $html = await preProcessHtml($html, url, config);

  // Run readability scripts
  let result;
  for (const [handlerName, handler] of Object.entries(handlers)) {
    if (await handler.canHandle($html, url, config)) {
      logger.info(`Processing ${url} using ${handlerName} handler`);
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

  return postProcessResult(result, url, config);
}

module.exports = readability;
