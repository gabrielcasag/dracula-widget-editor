let color = "#3aa757";

// set an initial state or complete some tasks on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    themeActive: false,
  });

  // chrome.action.setBadgeText({
  //   text: "OFF",
  // });
});
