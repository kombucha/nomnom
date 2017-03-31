module.exports = (userEntry, _, { loaders }) =>
  loaders.genericLoader.load(userEntry.user);
