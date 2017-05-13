import { readFileAsText } from "./utils";

export function importYoutubeSubscriptions(file) {
  return readFileAsText(file).then(fileContent => {
    const parser = new DOMParser();
    const opmlDoc = parser.parseFromString(fileContent, "text/xml");

    return Array.from(opmlDoc.querySelectorAll("outline > outline")).map(node => ({
      name: node.attributes.title.value,
      uri: node.attributes.xmlUrl.value,
      type: "RSS"
    }));
  });
}

export default importYoutubeSubscriptions;
