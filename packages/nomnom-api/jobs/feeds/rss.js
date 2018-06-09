const got = require("got");
const FeedParser = require("feedparser");
const pump = require("pump");

const postProcessReadability = require("../../core/readability/lib/postProcessResult");
const readabilityConfig = require("../../core/readabilityConfig");

function asEntry(item) {
  return {
    url: item.origlink || item.link,
    title: item.title,
    author: item.author,
    excerpt: item.summary,
    content: item.description,
    originalContent: item.description,
    published: item.pubdate
  };
}

function createRSSStream(url, cb) {
  const feedParser = new FeedParser();
  const rssStream = got.stream(url);

  // Why pump ? cuz stream.pipe doesn't forward errors !!11!
  return pump(rssStream, feedParser, cb);
}

function getFeedEntries(url) {
  return new Promise((resolve, reject) => {
    const rssItems = [];
    const onData = data => rssItems.push(asEntry(data));
    const onDone = err => {
      if (err) reject(err);
      Promise.all(
        rssItems.map(entry => postProcessReadability(entry, entry.url, readabilityConfig))
      ).then(resolve, e => reject(e));
    };

    createRSSStream(url, onDone).on("data", onData);
  });
}

module.exports = {
  getFeedEntries
};
