const { fixRelativeUrls } = require("./helpers");

const preProcessers = [fixRelativeUrls];

async function preProcessHtml($html, url, config) {
  let $preprocessedHtml = $html;

  for (const preProcess of preProcessers) {
    $preprocessedHtml = await preProcess($preprocessedHtml, url, config);
  }

  return $preprocessedHtml;
}

module.exports = preProcessHtml;
