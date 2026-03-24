const WISEQUERY_URL = "https://wisequery.app";

document.getElementById("askBtn").addEventListener("click", () => {
  const question = document.getElementById("question").value.trim();
  if (question) {
    const q = encodeURIComponent(question);
    chrome.tabs.create({ url: `${WISEQUERY_URL}/?q=${q}` });
    window.close();
  }
});

document.getElementById("openBtn").addEventListener("click", () => {
  chrome.tabs.create({ url: WISEQUERY_URL });
  window.close();
});

// Auto-fill with selected text from the active tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]) {
    chrome.scripting.executeScript(
      { target: { tabId: tabs[0].id }, func: () => window.getSelection()?.toString() || "" },
      (results) => {
        if (results?.[0]?.result) {
          document.getElementById("question").value = results[0].result;
        }
      }
    ).catch(() => {});
  }
});
