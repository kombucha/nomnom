const cheerio = require("cheerio");
const parseDate = require("date-fns/parse");
const {
  getTitle,
  getAuthor,
  getDescription,
  getImage,
  getWordCount,
  getDurationFromWordCount,
  getMetaValue
} = require("../helpers");

async function canHandle($html) {
  const meta = getMetaValue($html, "al:ios:app_name");
  return !!meta && meta.toLowerCase() === "medium";
}

async function process($html) {
  const title = getTitle($html);
  const author = getAuthor($html);
  const excerpt = getDescription($html);
  const publicationDate = getPublicationDate($html);
  const imageUrl = getImage($html);

  const content = grabArticle($html);
  const textContent = content ? content.text() : "";
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

function grabArticle($html) {
  const article = $html.find("article");
  article.find("header,h1,footer").remove();
  // Process figures
  article.find("figure").each((i, el) => {
    const $el = cheerio(el);
    const $image = $el.find("img").last();
    const isEmbed = $el.attr("class").includes("iframe");
    const hasImage = $image.length > 0;

    if (isEmbed || !hasImage) {
      $el.remove();
    } else {
      const imgSrc = $image.attr("data-src") || $image.attr("src");
      $el.replaceWith(`<img src="${imgSrc}"/>`);
    }
  });

  return article;
}

const PUBLICATION_DATE_REGEX = /article:published_time/;
function getPublicationDate($html) {
  const publicationDate = getMetaValue($html, PUBLICATION_DATE_REGEX);
  return parseDate(publicationDate).getTime();
}

module.exports = {
  canHandle,
  process
};
