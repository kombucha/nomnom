const cheerio = require("cheerio");
const parseDate = require("date-fns/parse");
const isValidDate = require("date-fns/is_valid");

const TITLE_META_NAMES = /og:title|title/i;
const AUTHOR_META_NAMES = /author|article:author|twitter:creator/i;
const DESCRIPTION_META_NAMES = /og:description|twitter:description|description/i;
const PUBLICATION_DATE_META_NAMES = /publication|publish(?!er)|date|time[\b|$]/i;
const IMAGE_META_NAMES = /og:image|twitter:image:src/i;

// Lifted from https://github.com/regexhq/word-regex, wtf npm ^^
const WORD_REGEX = /[a-zA-Z0-9_\u0392-\u03c9\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|[\u00E4\u00C4\u00E5\u00C5\u00F6\u00D6]+|\w+/g;
const AVG_WORDS_PER_SECOND = 275 / 60;

function getTitle($html) {
  return getMetaValue($html, TITLE_META_NAMES) || $html("title").text();
}

function getAuthor($html) {
  return getMetaValue($html, AUTHOR_META_NAMES);
}

function getDescription($html) {
  return getMetaValue($html, DESCRIPTION_META_NAMES);
}

function getPublicationDate($html) {
  const publicationDateValue = getMetaValue($html, PUBLICATION_DATE_META_NAMES);
  const date = publicationDateValue ? parseDate(publicationDateValue) : null;

  return date && isValidDate(date) ? date.getTime() : null;
}

function getImage($html) {
  return getMetaValue($html, IMAGE_META_NAMES);
}

/**
 * Counts the number of word in a given html,
 * @param {*} $html cheerio object
 * @return {number} number of words in the html.
 */
function getWordCount($html) {
  const wordCountMatch = $html.text().match(WORD_REGEX);
  return wordCountMatch ? wordCountMatch.length : 0;
}

/**
 * Takes a word count and returns the average duration to read those words.
 * @param {number} wordCount
 * @return {number} duration in seconds
 */
function getDurationFromWordCount(wordCount) {
  return Math.round(wordCount / AVG_WORDS_PER_SECOND);
}

/**
 * Search for a meta tag with the corresponding name
 * and returns the first matching value.
 * @param {*} $html cheerio object
 * @param {string|RegExp} metaNameRegex the name of the metadata
 * @return {string} the metadata value if found, null otherwise.
 */
function getMetaValue($html, metaNameRegex) {
  const meta = $html
    .find("meta")
    .get()
    .find(meta => {
      const $meta = cheerio(meta);
      const name = $meta.attr("name") || $meta.attr("property") || $meta.attr("itemprop") || null;
      return name ? name.match(metaNameRegex) : false;
    });

  return meta ? cheerio(meta).attr("content") : null;
}

module.exports = {
  getTitle,
  getAuthor,
  getDescription,
  getPublicationDate,
  getImage,
  getWordCount,
  getDurationFromWordCount,

  getMetaValue
};
