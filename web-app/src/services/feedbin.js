import { readFileAsText } from "./utils";

function importFavorites(favoritesFile) {
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

export default {
  importFavorites
};
