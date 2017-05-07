import { readFileAsText } from "./utils";

function pocketLinkToEntry(status, link) {
  return {
    url: link.attributes.href.value,
    status,
    creationDate: new Date(parseInt(link.attributes.time_added.value, 10) * 1000),
    tags: link.attributes.tags.value ? link.attributes.tags.value.split(",") : []
  };
}

function importPocketExport(file) {
  return readFileAsText(file).then(fileContent => {
    const container = document.createElement("div");
    container.innerHTML = fileContent;

    const [unreadList, readList] = container.querySelectorAll("ul");
    const unreadEntries = Array.from(unreadList.querySelectorAll("a")).map(link =>
      pocketLinkToEntry("LATER", link)
    );
    const readEntries = Array.from(readList.querySelectorAll("a")).map(link =>
      pocketLinkToEntry("ARCHIVED", link)
    );

    return [...unreadEntries, ...readEntries];
  });
}

export default importPocketExport;
