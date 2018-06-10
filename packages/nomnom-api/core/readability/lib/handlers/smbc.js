const cheerio = require("cheerio");
const {
  getTitle,
  getAuthor,
  getDescription,
  getWordCount,
  getDurationFromWordCount,
  getPublicationDate,
  getImage
} = require("../helpers");

async function canHandle($html, url) {
  return url.includes("smbc-comics.com/");
}

async function process($html) {
  const title = getTitle($html);
  const author = getAuthor($html);
  const excerpt = getDescription($html);
  const publicationDate = getPublicationDate($html);
  const imageUrl = getImage($html);

  const content = cheerio.load(`<article>${$html.find("#cc-comic").toString()}</article>`).root();
  const textContent = title;
  const originalContent = $html.html();
  const wordCount = getWordCount(textContent);
  const duration = getDurationFromWordCount(wordCount);

  return {
    title,
    author,
    publicationDate,
    excerpt,
    imageUrl,

    content,
    textContent,
    originalContent,

    wordCount,
    duration
  };
}

module.exports = {
  canHandle,
  process
};
