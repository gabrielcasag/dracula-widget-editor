async function initialize(tab) {
  //verify if the user is on widget editor page and has some widget open
  let url = tab.url;
  let isWidgetEditorPage = url.includes("id=widget_editor");
  let urlWidgetIdSplit = url.includes("&sys_id=") ? url.split("&sys_id=") : [];
  let hasWidgetOpenOnEditor = urlWidgetIdSplit[1]?.length >= 32;

  if (!isWidgetEditorPage && !hasWidgetOpenOnEditor) return;

  const { themeActive } = await chrome.storage.sync.get("themeActive");

  if (themeActive) {
    await chrome.scripting.insertCSS({
      files: ["src/styles/dracula-editor.css"],
      target: { tabId: tab.id },
    });

    await chrome.storage.sync.set({ themeActive: true });
  }
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => initialize(tab));
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    initialize(tab);
  }
});

// set an initial state or complete some tasks on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ themeActive: false });
});
