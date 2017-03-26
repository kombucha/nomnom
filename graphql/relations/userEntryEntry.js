module.exports = (userEntry, _, { loaders }) =>
  loaders.genericLoader.load(userEntry.entry).then(entry => entry);
