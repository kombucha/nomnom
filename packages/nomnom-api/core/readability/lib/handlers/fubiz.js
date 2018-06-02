const cheerio = require("cheerio");
const {
  getTitle,
  getAuthor,
  getDescription,
  getWordCount,
  getDurationFromWordCount,
  getPublicationDate
} = require("../helpers");

async function canHandle($html, url) {
  return url.includes("fubiz.net/");
}

async function process($html) {
  const title = getTitle($html);
  const author = $html.find(".post-author").text() || getAuthor($html);
  const excerpt = getDescription($html);
  const specificPublicationDate = $html.find(".container-info-article time").attr("datetime");
  const publicationDate = specificPublicationDate
    ? new Date(specificPublicationDate).getTime()
    : getPublicationDate($html);
  const imageUrl = $html.find("link[rel=apple-touch-icon]").attr("href");

  const content = $html.find("#post-content");

  // Process images
  content
    .find("img[data-original]")
    .get()
    .forEach(img => {
      const $img = cheerio(img);
      $img.attr("src", $img.attr("data-original"));
    });

  const textContent = content.text();
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
