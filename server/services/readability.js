// Reimplement readability with cheerio ?

const jsdom = require("jsdom");
const cheerio = require("cheerio");
const Readability = require("readability");

// Lifted from https://github.com/regexhq/word-regex, wtf npm ^^
const WORD_REGEX = /[a-zA-Z0-9_\u0392-\u03c9\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|[\u00E4\u00C4\u00E5\u00C5\u00F6\u00D6]+|\w+/g;
const AVG_WORDS_PER_SECOND = 275 / 60;

function extractWordCount(htmlContent) {
  const text = cheerio.load(htmlContent).text();
  return text.match(WORD_REGEX).length;
}

function durationFromWordCount(wordCount) {
  return Math.round(wordCount / AVG_WORDS_PER_SECOND);
}

function extractImageUrl(htmlContent) {
  const $ = cheerio.load(htmlContent);
  return $('meta[property="og:image"],meta[name="twitter:image:src"]').attr(
    "content"
  );
}

function readability(url) {
  return new Promise((resolve, reject) => {
    jsdom.env({
      url,
      // html,
      done: (err, window) => {
        if (err) {
          reject(err);
        }

        const document = window.document;

        // Yewwww: Mozilla's readability doesn't seem to be made to run outside the browser
        // and expects Node to be globally available
        const oldGlobalNode = global.Node;
        global.Node = window.Node;
        // /Yewwww

        const uri = decodeURI(url);
        const originalContent = document.documentElement.innerHTML;
        const readabilityArticle = new Readability(uri, document).parse();
        const wordCount = extractWordCount(readabilityArticle.content);

        // Cleanup
        window.close();
        global.Node = oldGlobalNode;

        if (!readabilityArticle) {
          return reject(new Error("Couldn't extract article"));
        }

        const fullArticle = Object.assign(
          {
            originalContent,
            wordCount,
            duration: durationFromWordCount(wordCount),
            imageUrl: extractImageUrl(originalContent)
          },
          readabilityArticle
        );

        return resolve(fullArticle);
      }
    });
  });
}

module.exports = readability;
