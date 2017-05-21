import { readFileAsText } from "./utils";

export function importFavorites(favoritesFile) {
  return readFileAsText(favoritesFile)
    .then(fileContent => JSON.parse(fileContent))
    .then(favoritesJson => {
      return favoritesJson.map(f => ({
        url: f.url,
        creationDate: f["created_at"],
        status: "FAVORITE"
      }));
    });
}

export function importSubscriptions(subscriptionsFile) {
  return readFileAsText(subscriptionsFile).then(fileContent => {
    const parser = new DOMParser();
    const opmlDoc = parser.parseFromString(fileContent, "text/xml");

    return Array.from(
      opmlDoc.querySelectorAll("outline[xmlUrl]")
    ).map(node => ({
      name: node.attributes.title.value,
      uri: node.attributes.xmlUrl.value,
      type: "RSS"
    }));
  });
}

export default {
  importFavorites,
  importSubscriptions
};
