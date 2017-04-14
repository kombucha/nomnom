const url = require("url");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const cheerio = require("cheerio");
const mime = require("mime-types");
const got = require("got");

const { imagesPath } = require("../config");

const TOP_CANDIDATES = 5;
const TITLE_META_SELECTOR = 'meta[property="og:title"],meta[name="title"]';
const AUTHOR_META_SELECTOR = 'meta[property="author"],meta[property="article:author"],meta[name="twitter:creator"]';
const DESCRIPTION_META_SELECTOR = 'meta[property="og:description"],meta[name="twitter:description"],meta[name="description"]';
const IMAGE_META_SELECTOR = 'meta[property="og:image"],meta[name="twitter:image:src"]';
const UNLIKELY_CANDIDATES = /banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|extra|foot|header|legends|menu|modal|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i;
const OK_MAYBE_ITS_A_CANDIDATE = /and|article|body|column|main|shadow/i;
const POSITIVE_SCORE_NAMES = /article|body|content|entry|hentry|h-entry|main|page|pagination|post|text|blog|story/i;
const NEGATIVE_SCORE_NAMES = /hidden|^hid$| hid$| hid |^hid |banner|combx|comment|com-|contact|foot|footer|footnote|masthead|media|meta|modal|outbrain|promo|related|scroll|share|shoutbox|sidebar|skyscraper|sponsor|shopping|tags|tool|widget/i;
const VIDEOS_EMBED_ATTRIBUTES = /\/\/(www\.)?(dailymotion|youtube|youtube-nocookie|player\.vimeo)\.com/i;
const ALTER_TO_DIV_EXCEPTIONS = ["div", "article", "section", "p"];
const DEFAULT_TAGS_TO_SCORE = [
  "section",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "td",
  "pre"
];
// Lifted from https://github.com/regexhq/word-regex, wtf npm ^^
const WORD_REGEX = /[a-zA-Z0-9_\u0392-\u03c9\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|[\u00E4\u00C4\u00E5\u00C5\u00F6\u00D6]+|\w+/g;
const AVG_WORDS_PER_SECOND = 275 / 60;

async function readability(url) {
  const response = await got(url);
  const originalContent = String(response.body);
  const $html = cheerio.load(originalContent);

  // Prepwork
  preProcessHtml($html);

  // Metadata
  // ENHANCEMENT: get first non null ? (right now, just gets the first that matches)
  const title = getArticleTitle($html);
  const author = $html(AUTHOR_META_SELECTOR).attr("content");
  const excerpt = $html(DESCRIPTION_META_SELECTOR).attr("content");
  const imageUrl = $html(IMAGE_META_SELECTOR).attr("content");

  // Article
  const $article = grabArticle($html);
  fixRelativeUrls(url, $article);
  await processImages($article);

  const content = $article.html();
  const textContent = $article.text();
  const wordCount = extractWordCount($article);
  const duration = durationFromWordCount(wordCount);

  return {
    title,
    author,
    excerpt,
    imageUrl,

    content,
    textContent,
    originalContent,

    wordCount,
    duration
  };
}

function grabArticle($page) {
  const CONTENT_ELEMENTS = [
    "div",
    "section",
    "header",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6"
  ];

  while (true) {
    const elementsToScore = [];
    let $node = $page("body").clone();

    while ($node) {
      const nodeName = getNodeName($node);
      const matchString = getNodeMatchString($node);

      // Remove unlikely candidate
      const isUnlikelyCandidate = UNLIKELY_CANDIDATES.test(matchString) &&
        !OK_MAYBE_ITS_A_CANDIDATE.test(matchString) &&
        nodeName !== "body" &&
        nodeName !== "a";

      if (isUnlikelyCandidate) {
        $node = removeAndGetNext($node);
        continue;
      }

      const isContentContainer = CONTENT_ELEMENTS.indexOf(nodeName) !== -1;
      const containerHasContent = hasContent($node);

      if (isContentContainer && !containerHasContent) {
        $node = removeAndGetNext($node);
        continue;
      }

      const shouldBeScored = DEFAULT_TAGS_TO_SCORE.indexOf(nodeName) !== -1;
      if (shouldBeScored) {
        elementsToScore.push($node);
      }

      // TODO: Turn all divs that don't have children block level elements into p's
      $node = getNextNode($node); // next node
    }

    // Score candidates
    const candidates = [];
    elementsToScore.forEach($el => {
      let contentScore = 0;
      const hasParent = $el.parent().length > 0;
      if (!hasParent) {
        return;
      }

      const normalizedText = normalizeText($el.text());

      if (normalizedText.length < 25) {
        return;
      }

      // Add a point for the paragraph itself as a base.
      // Add points for any commas within this paragraph.
      // For every 100 characters in this paragraph, add another point. Up to 3 points.
      contentScore += 1;
      contentScore += normalizedText.split(",").length;
      contentScore += Math.min(Math.floor(normalizedText.length / 100), 3);

      const ancestors = $el.parents().slice(0, 3);
      ancestors.each((level, ancestor) => {
        const $ancestor = cheerio(ancestor);
        const ancestorName = getNodeName($ancestor);
        if (!ancestorName) {
          return;
        }

        let ancestorScore = $ancestor.data("readabilityScore");
        if (!ancestorScore) {
          ancestorScore = getInitialAncestorReadabilityScore($ancestor);
          candidates.push($ancestor);
        }

        const divider = level === 0 ? 1 : level === 1 ? 2 : level * 3;
        ancestorScore += contentScore / divider;
        $ancestor.data("readabilityScore", ancestorScore);
      });
    });

    // Top candidates
    const topCandidates = [];
    for (let c = 0; c < candidates.length; c++) {
      const $candidate = candidates[c];
      const candidateScore = $candidate.data("readabilityScore");
      const adjustedScore = candidateScore * (1 - getLinkDensity($candidate));
      $candidate.data("readabilityScore", adjustedScore);

      for (let t = 0; t < TOP_CANDIDATES; t++) {
        const $topCandidate = topCandidates[t];
        const topCandidateScore = $topCandidate
          ? $topCandidate.data("readabilityScore")
          : 0;

        if (!$topCandidate || adjustedScore > topCandidateScore) {
          topCandidates.splice(t, 0, $candidate);
          if (topCandidates.length > TOP_CANDIDATES) topCandidates.pop();
          break;
        }
      }
    }

    const $topCandidate = topCandidates[0] || null;
    let $parentOfTopCandidate;

    if (!$topCandidate) {
      // TODO
      throw new Error("Handle case where no top candidate has been found");
    }

    // TODO: try to find better candidate

    // Build article content
    const topCandidateScore = $topCandidate.data("readabilityScore");
    const $articleContent = cheerio.load("<div></div>")("div");
    const siblingScoreThreshold = Math.max(10, topCandidateScore * 0.2);
    $parentOfTopCandidate = $topCandidate.parent();
    const $siblings = $parentOfTopCandidate.children();

    $siblings.each((i, $sibling) => {
      $sibling = cheerio($sibling);
      const siblingNodeName = getNodeName($sibling);
      let append = false;

      if ($sibling.eq($topCandidate)) {
        append = true;
      } else {
        let contentBonus = 0;
        const siblingScore = $sibling.data("readabilityScore");

        if (
          $sibling.attr("class") === $topCandidate.attr("class") &&
          !!$topCandidate.attr("class")
        ) {
          contentBonus += topCandidateScore * 0.2;
        }

        if (
          siblingScore && siblingScore + contentBonus >= siblingScoreThreshold
        ) {
          append = true;
        } else if (siblingNodeName === "P") {
          const linkDensity = getLinkDensity($sibling);
          const normalizedText = normalizeText($sibling);
          const textLength = normalizedText.length;

          if (textLength > 80 && linkDensity < 0.25) {
            append = true;
          } else if (
            textLength < 80 &&
            textLength > 0 &&
            linkDensity === 0 &&
            normalizedText.search(/\.( |$)/) !== -1
          ) {
            append = true;
          }
        }
      }

      if (!append) {
        return;
      }

      if (ALTER_TO_DIV_EXCEPTIONS.indexOf(siblingNodeName) !== -1) {
        $sibling.replaceWith(`<div>${$sibling.html()}</div>`);
      }

      $articleContent.append($sibling);
    });

    cleanArticle($articleContent);

    return $articleContent;
  }
}

async function processImages($html) {
  // TODO: check for duplicates
  $html
    .find("img")
    .each(async (i, img) => {
      const $img = cheerio(img);
      const imgUrl = $img.attr("src");
      const cachedUrl = await cacheImage(imgUrl);
      $img.attr("src", cachedUrl);
    })
    .get();
}

async function cacheImage(imageUrl) {
  return new Promise((resolve, reject) => {
    const imgStream = got.stream(imageUrl);
    let newImageUrl;

    imgStream
      .on("response", response => {
        const imgHash = hash(imageUrl);
        const imgExtension = mime.extension(response.headers["content-type"]);
        const newImageName = `${imgHash}.${imgExtension}`;
        const imagePath = path.resolve(imagesPath, newImageName);
        newImageUrl = url.resolve("/img/", newImageName);
        imgStream.pipe(fs.createWriteStream(imagePath));
      })
      .on("end", () => resolve(newImageUrl))
      .on("error", reject);
  });
}

function hash(data) {
  return crypto.createHash("md5").update(data).digest("hex");
}

// METADATA HELPERS
// Should I be smarter for the title ? they do a lot of stuff in readability.js
// See https://github.com/mozilla/readability/blob/master/Readability.js#L304
function getArticleTitle($html) {
  return $html(TITLE_META_SELECTOR).attr("content") || $html("title").text();
}

function extractWordCount($html) {
  return $html.text().match(WORD_REGEX).length;
}

function durationFromWordCount(wordCount) {
  return Math.round(wordCount / AVG_WORDS_PER_SECOND);
}

// HELPERS
function preProcessHtml($html) {
  $html("script,noscript").remove();
  $html("style,link[rel=stylesheet]").remove();

  // TODO Turn <div>foo<br>bar<br> <br><br>abc</div>  into   <div>foo<br>bar<p>abc</p></div>
  // Replace <font> by <span>
  $html("font").each((i, el) => {
    const e = cheerio(el);
    e.replaceWith(`<span>${e.html()}</span>`);
  });
}

function fixRelativeUrls(baseUrl, $html) {
  $html.find("a").each((i, link) => {
    const $link = cheerio(link);
    const href = $link.attr("href") || "";
    if (href.indexOf("javascript:") === 0) {
      $link.removeAttr("href");
    } else {
      $link.attr("href", toAbsoluteUrl(baseUrl, href));
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

function cleanArticle($article) {
  $article.find("*").removeAttr("style");

  markDataTable($article);

  cleanFishyNodes($article, "form,fieldset");
  $article.find("h1,footer").remove();

  // Clean sharing content
  $article.find("[class*=share],[id*=share]").remove();
  // TODO: Remove h2 which are actually the article title

  // Clean embed that are not whitelisted
  $article
    .find("object,embed,iframe")
    .filter((i, el) => !isWhitelistedEmbed(el))
    .remove();

  // Clean form elements
  $article.find("input,textarea,select,button").remove();

  // Clean out spurious headers
  $article
    .find("h1,h2,h3")
    .filter((i, header) => getClassIdScore(cheerio(header)) < 0)
    .remove();

  // Do these last as the previous stuff may have removed junk that will affect these
  cleanFishyNodes($article, "table");
  cleanFishyNodes($article, "ul");
  cleanFishyNodes($article, "div");

  // Remove extra, empty Ps
  $article
    .find("p")
    .filter((i, el) => {
      const $el = cheerio(el);
      const contentElCount = $el.find("img,embed,object,iframe").length;
      return contentElCount === 0 && $el.text().length === 0;
    })
    .remove();

  $article.find("img").removeAttr("srcset,onerror"); // Remove srcset for now, handle it later
  $article.find("*").removeAttr("class");
  // TODO: remove custom data- attributes

  return $article;
}

function markDataTable($html) {
  $html.find("table").each((i, table) => {
    const $table = cheerio(table);
    if ($table.attr("role") === "presentation") {
      $table.data("readabilityDataTable", false);
      return;
    }
    if ($table.attr("summary")) {
      $table.data("readabilityDataTable", true);
      return;
    }

    const captions = $table.find("caption");
    if (captions.length && captions.children().length > 0) {
      $table.data("readabilityDataTable", true);
      return;
    }

    if ($table.find("col,colgroup,tfoot,thead,th,table").length > 0) {
      $table.data("readabilityDataTable", true);
      return;
    }

    const columnsCount = $table.find("tr").length;
    const rowsCount = $table.find("tr").length;

    $table.data(
      "readabilityDataTable",
      rowsCount >= 10 || columnsCount < 4 || rowsCount * columnsCount > 10
    );
  });
}

function cleanFishyNodes($node, selector) {
  $node.find(selector).filter((i, el) => isFishy(cheerio(el))).remove();
}

function isFishy($node) {
  const tagName = getNodeName($node);
  const isList = tagName === "ul" || tagName === "ol";
  const score = getClassIdScore($node);
  const text = $node.text();
  const commasCount = text.split(",").length;
  const pCount = $node.find("p").length;
  const imgCount = $node.find("img").length;
  const liCount = $node.find("li").length - 100;
  const inputCount = $node.find("input").length;
  const embedCount = $node.find("embed");
  const hasDataTableAncestor = hasAncestor(
    $node,
    $n => !!$n.data("readabilityDataTable")
  );
  const hasFigureAncestor = hasAncestor(
    $node,
    $n => getNodeName($n) === "figure"
  );
  const linkDensity = getLinkDensity($node);

  const shouldBeRemoved = commasCount < 10 &&
    ((imgCount > 1 && pCount / imgCount < 0.5 && hasFigureAncestor) ||
      (!isList && liCount > pCount) ||
      inputCount > Math.floor(pCount / 3) ||
      (!isList &&
        text.length < 25 &&
        (imgCount === 0 || imgCount > 2) &&
        hasFigureAncestor) ||
      (!isList && score < 25 && linkDensity > 0.2) ||
      (score >= 25 && linkDensity > 0.5) ||
      ((embedCount === 1 && text.length < 75) || embedCount > 1));
  const isScoreOk = score >= 0;
  const isOk = hasDataTableAncestor || isScoreOk || !shouldBeRemoved;

  return !isOk;
}

function hasAncestor($node, matchFn) {
  let $parent = $node.parent();
  let matches = false;

  while ($parent.length && !matches) {
    matches = matchFn($parent);
    $parent = $parent.parent();
  }

  return matches;
}

function isWhitelistedEmbed(embedEl) {
  const attributeValues = Object.values(embedEl.attribs).join("|");

  return VIDEOS_EMBED_ATTRIBUTES.test(attributeValues) ||
    VIDEOS_EMBED_ATTRIBUTES.test(cheerio(embedEl).html());
}

function hasContent($el) {
  return $el.text().trim().length > 0 ||
    $el.children(":not(hr, br)").length > 0;
}

function removeAndGetNext($node) {
  const $nextNode = getNextNode($node, true);
  $node.remove();
  return $nextNode;
}

function getNodeName($node) {
  return ($node.get(0).name || $node.get(0).tagName || "").toLowerCase();
}

function getNodeMatchString($node) {
  return `${$node.attr("class") || ""} ${$node.attr("id") || ""}`;
}

function getNextNode($node, ignoreSelfAndKids) {
  if (!ignoreSelfAndKids && $node.children().length > 0) {
    return $node.children().first();
  }

  const $nextSibling = $node.next();
  if ($nextSibling.length > 0) {
    return cheerio($nextSibling);
  }

  const parent = $node.parent();
  return parent.length > 0 ? getNextNode(parent, true) : null;
}

function normalizeText(str) {
  return str ? str.trim().replace(/\s{2,}/, " ") : "";
}

function getInitialAncestorReadabilityScore($node) {
  let readabilityScore = 0;

  switch (getNodeName($node)) {
    case "div":
      readabilityScore += 5;
      break;

    case "pre":
    case "td":
    case "blockquote":
    case "code":
      readabilityScore += 3;
      break;

    case "address":
    case "ol":
    case "ul":
    case "dl":
    case "dd":
    case "dt":
    case "li":
    case "form":
      readabilityScore -= 3;
      break;

    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
    case "th":
      readabilityScore -= 5;
      break;
  }

  readabilityScore += getClassIdScore($node);

  return readabilityScore;
}

function getClassIdScore($node) {
  let score = 0;
  const className = $node.attr("class") || "";
  const id = $node.attr("id") || "";

  // Look for a special classname
  if (className) {
    if (NEGATIVE_SCORE_NAMES.test(className)) score -= 25;
    if (POSITIVE_SCORE_NAMES.test(className)) score += 25;
  }

  // Look for a special ID
  if (id) {
    if (NEGATIVE_SCORE_NAMES.test(id)) score -= 25;
    if (POSITIVE_SCORE_NAMES.test(id)) score += 25;
  }

  return score;
}

function getLinkDensity($node) {
  const textLength = normalizeText($node.text()).length;
  if (textLength === 0) {
    return 0;
  }

  let linkLength = 0;
  $node.find("a").each((i, el) => {
    linkLength += normalizeText(cheerio(el).text()).length;
  });

  return linkLength / textLength;
}

module.exports = readability;
