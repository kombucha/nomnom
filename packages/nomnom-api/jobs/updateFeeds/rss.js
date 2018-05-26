const FeedParser = require("feedparser");
const got = require("got");
const pump = require("pump");

function asEntry(item) {
  return {
    url: item.origlink || item.link,
    title: item.title,
    author: item.author,
    excerpt: item.summary,
    content: item.description,
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
    const onDone = err => (err ? reject(err) : resolve(rssItems));

    createRSSStream(url, onDone).on("data", onData);
  });
}

module.exports = {
  getFeedEntries
};
