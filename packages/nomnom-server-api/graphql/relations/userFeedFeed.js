module.exports = (userFeed, _, { loaders }) =>
  loaders.feed.load(userFeed.FeedId);
