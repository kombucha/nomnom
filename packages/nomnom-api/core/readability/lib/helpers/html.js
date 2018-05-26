const url = require("url");
const cheerio = require("cheerio");

const ATTRIBUTES_WHITELIST = ["src", "href", "alt", "target", "title"];
const ATTRIBUTES_ELEMENT_WHITELIST = ["iframe"];

/**
 * Transforms all urls to absolute ones
 * @param {*} $html cheerio object
 * @param {string} baseUrl the base url to resolve against
 * @return the html with absolute url
 */
function fixRelativeUrls($html, baseUrl) {
  $html.find("a").each((i, link) => {
    const $link = cheerio(link);
    const href = $link.attr("href") || "";
    if (href.indexOf("javascript:") === 0) {
      $link.removeAttr("href");
    } else {
      $link.attr("href", toAbsoluteUrl(baseUrl, href));
      $link.attr("target", "_blank");
      $link.attr("ref", "noopener noreferrer");
    }
  });

  $html.find("img").each((i, img) => {
    const $img = cheerio(img);
    const src = $img.attr("src") || "";
    $img.attr("src", toAbsoluteUrl(baseUrl, src));
  });

  return $html;
}

function toAbsoluteUrl(from, to) {
  // Remove anchor and last /
  const normalizedFrom = from.replace(/#.*?$/, "").replace(/\/$/, "");
  return url.resolve(normalizedFrom, to);
}

/**
 * Removes all styles, scripts and attributes which are not whitelisted.
 * @param {*} $html cheerio object
 * @return the cleaned up html
 */
function clean($html) {
  // Clean scripts
  $html.find("script,noscript").remove();

  // Clean styles
  $html.find("style,link[rel=stylesheet]").remove();

  // Clean form elements
  $html.find("input,textarea,select,button").remove();

  // Clean sharing content
  $html.find("[class*=share],[id*=share]").remove();

  // Clean all attributes that are not whitelisted
  $html.find("*").each((i, el) => {
    if (ATTRIBUTES_ELEMENT_WHITELIST.includes(el.name.toLowerCase())) {
      return;
    }

    const $el = cheerio(el);
    Object.keys(el.attribs).forEach(attr => {
      if (!ATTRIBUTES_WHITELIST.includes(attr)) {
        $el.removeAttr(attr);
      }
    });
  });

  return $html;
}

module.exports = { fixRelativeUrls, clean };
