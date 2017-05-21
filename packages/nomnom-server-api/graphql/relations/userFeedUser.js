module.exports = (userFeed, _, { loaders }) =>
  loaders.user.load(userFeed.UserId);
