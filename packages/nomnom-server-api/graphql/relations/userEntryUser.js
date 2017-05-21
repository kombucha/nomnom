module.exports = (userEntry, _, { loaders }) =>
  loaders.user.load(userEntry.UserId);
