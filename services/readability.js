const jsdom = require("jsdom");
const Readability = require("readability");

const AVG_WORDS_PER_SECOND = 275 / 60;

function durationFromWordCount(wordCount) {
  return Math.round(wordCount / AVG_WORDS_PER_SECOND);
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

        // Cleanup
        window.close();
        global.Node = oldGlobalNode;

        if (!readabilityArticle) {
          return reject(new Error("Couldn't extract article"));
        }

        const fullArticle = Object.assign(
          {
            originalContent,
            duration: durationFromWordCount(readabilityArticle)
          },
          readabilityArticle
        );

        return resolve(fullArticle);
      }
    });
  });
}

module.exports = readability;
