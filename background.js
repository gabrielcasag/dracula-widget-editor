// set an initial state or complete some tasks on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ themeActive: false });
});
