console.log(`popup`);

// Initialize button with user's preferred color
let switchBtn = document.getElementById("switch-btn");

chrome.storage.sync.get("themeActive", ({ themeActive }) => {
  if (themeActive) {
    switchBtn.style.backgroundColor = themeActive;
  }
});

// When the button is clicked, inject setWidgetEditorTheme into current page
// chrome.action.onClicked.addListener;
switchBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setWidgetEditorTheme,
    args: [tab.url],
  });
});

// The body of this function will be executed as a content script inside the
// current page
async function setWidgetEditorTheme(url) {
  let urlSplitted = url.split("?id=");

  let isWidgetEditorPage = false;
  if (urlSplitted.length > 1 && urlSplitted[1].startsWith("widget_editor")) {
    isWidgetEditorPage = true;
  }

  if (!isWidgetEditorPage) return;

  let containerBgs = document.getElementsByClassName("CodeMirror-scroll");

  if (containerBgs.length > 1) {
    [...containerBgs].forEach((element) => {
      element.style.backgroundColor = "#282a36";
    });
  } else {
    containerBgs[0].style.backgroundColor = "#282a36";
  }

  let allTags = document.querySelectorAll(".cm-s-default span.cm-tag");
  allTags.forEach((tag) => {
    tag.style.color = "#ff79c6";
  });

  let allBrackets = document.querySelectorAll(".cm-s-default span.cm-bracket");
  allBrackets.forEach((bracket) => {
    bracket.style.color = "#f8f8f2";
  });

  let allAttributes = document.querySelectorAll(
    ".cm-s-default span.cm-attribute"
  );
  allAttributes.forEach((attribute) => {
    attribute.style.color = "#50fa7b";
  });

  // get data from storage
  // chrome.storage.sync.get("color", ({ color }) => {
  //   document.body.style.backgroundColor = color;
  // });

  // // Insert the CSS file when the user turns the extension on
  // await chrome.scripting.insertCSS({
  //   files: ["focus-mode.css"],
  //   target: { tabId: tab.id },
  // });
}
