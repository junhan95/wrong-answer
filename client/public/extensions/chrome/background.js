const WISEQUERY_URL = "https://wisequery.app";

// Context menu: send selected text to WiseQuery
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "send-to-wisequery",
    title: "WiseQuery에 질문하기: \"%s\"",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "send-to-wisequery" && info.selectionText) {
    const text = encodeURIComponent(info.selectionText);
    chrome.tabs.create({ url: `${WISEQUERY_URL}/?q=${text}` });
  }
});

// Open WiseQuery when extension icon is clicked (fallback)
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: WISEQUERY_URL });
});
