const API_URL = "https://nomnom-api.limbocitizen.com/graphql";

chrome.browserAction.onClicked.addListener(tab => {
  addToNomNom(tab.url)
    .then(data => {
      chrome.tabs.sendMessage(tab.id, {
        type: "success",
        data
      });
    })
    .catch(error => {
      chrome.tabs.sendMessage(tab.id, {
        type: "failure",
        error
      });
    });
});

function addToNomNom(url) {
  return getToken()
    .then(token => {
      const payload = {
        operationName: "addUserEntry",
        variables: {
          addUserEntryInput: { url }
        },
        query:
          "mutation addUserEntry($addUserEntryInput: AddUserEntryInput!) { addUserEntry(addUserEntryInput: $addUserEntryInput) { id } }"
      };

      return fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
    })
    .then(r => r.json())
    .then(r => {
      if (r.errors) {
        throw r.errors;
      }

      return r.data;
    });
}

function getToken() {
  return new Promise(resolve => {
    chrome.cookies.getAll({ name: "token" }, ([tokenCookie]) => {
      resolve(tokenCookie.value);
    });
  });
}
