chrome.runtime.onMessage.addListener((payload, sender, sendResponse) => {
  switch (payload.type) {
    case "ping":
      return sendResponse("pong");
    case "success":
      return alert("Page successfully added to nomnom !");
    case "failure":
      return alert("Failed to add page to nomnom...");
  }
});
