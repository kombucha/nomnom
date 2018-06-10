chrome.runtime.onMessage.addListener(payload => {
  switch (payload.type) {
    case "success":
      alert("Page successfully added to nomnom !");
      return;
    case "failure":
      alert("Failed to add page to nomnom...");
      return;
  }
});
