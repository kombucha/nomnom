const cheerio = require("cheerio");
const handlers = require("./lib/handlers");
const { fixRelativeUrls, processImages, clean } = require("./lib/helpers");
const load = require("./lib/load");

const preProcessers = [fixRelativeUrls];
const postProcessers = [clean, processImages];

async function readability(url, config) {
  const response = await load(url);
  const htmlStr = String(response.body);

  // Common preprocessing
  let $html = cheerio.load(htmlStr, { useHtmlParser2: true })("html");
  for (const preProcess of preProcessers) {
    $html = await preProcess($html, url, config);
  }

  // Run readability scripts
  let result;
  for (const handler of handlers) {
    if (await handler.canHandle($html, url, config)) {
      try {
        result = await handler.process($html, url, config);
        break;
      } catch (e) {
        console.error("Failed halfway through", e);
      }
    }
  }

  // Common post processing
  let postProcessedContent = result.content;
  for (const postProcess of postProcessers) {
    postProcessedContent = await postProcess(postProcessedContent, url, config);
  }
  result.content = postProcessedContent.html();

  return result;
}

module.exports = readability;
