const CONFIGS = [
  {
    id: "ask-chatgpt-fix-grammars",
    title: "Fix grammars",
  },
  {
    id: "ask-chatgpt-extend",
    title: "Extend",
  },
  {
    id: "ask-chatgpt-translate-english",
    title: "Translate to English",
  },
  {
    id: "ask-chatgpt-translate-spanish",
    title: "Translate to Spanish",
  },
  {
    id: "ask-chatgpt-translate-french",
    title: "Translate to French",
  }
];

// Create a context menu item
chrome.contextMenus.create({
  id: "ask-chatgpt",
  title: "Ask ChatGPT",
  contexts: ["all"],
});

for (var i = 0; i < CONFIGS.length; i++) {
  // Create a context menu item

    chrome.contextMenus.create({
      id: CONFIGS[i].id,
      title: CONFIGS[i].title,
      contexts: ["all"],
    });
}

// Listen for when the user clicks on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith("ask-chatgpt")) {
    // Send a message to the content script
    chrome.tabs.sendMessage(tab.id, { type: info.menuItemId });
  }
});
