console.log(`popup`);

// Initialize button with user's preferred color
let switchBtn = document.getElementById("switch-input");

// When the button is clicked, inject setWidgetEditorTheme into current page
// chrome.action.onClicked.addListener;
switchBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  let urlSplitted = tab.url.split("?id=");

  let isWidgetEditorPage = false;
  if (urlSplitted.length > 1 && urlSplitted[1].startsWith("widget_editor")) {
    isWidgetEditorPage = true;
  }

  if (!isWidgetEditorPage) {
    setTimeout(() => {
      switchBtn.checked = false;
    }, 200);

    return;
  }

  if (switchBtn.checked === true) {
    // Insert the CSS file when the user turns the extension on
    await chrome.scripting.insertCSS({
      files: ["dracula-editor.css"],
      target: { tabId: tab.id },
    });
  } else if (switchBtn.checked === false) {
    // Remove the CSS file when the user turns the extension off
    await chrome.scripting.removeCSS({
      files: ["dracula-editor.css"],
      target: { tabId: tab.id },
    });
  }

  // chrome.scripting.executeScript({
  //   target: { tabId: tab.id },
  //   function: setWidgetEditorTheme,
  //   args: [tab.url],
  // });
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

  // commenting js way to try css way

  // let containerBgs = document.getElementsByClassName("CodeMirror-scroll");

  // if (containerBgs.length > 1) {
  //   [...containerBgs].forEach((element) => {
  //     element.style.backgroundColor = "#282a36";
  //   });
  // } else {
  //   containerBgs[0].style.backgroundColor = "#282a36";
  // }

  // let allTags = document.querySelectorAll(".cm-s-default span.cm-tag");
  // allTags.forEach((tag) => {
  //   tag.style.color = "#ff79c6";
  // });

  // let allBrackets = document.querySelectorAll(".cm-s-default span.cm-bracket");
  // allBrackets.forEach((bracket) => {
  //   bracket.style.color = "#f8f8f2";
  // });

  // let allAttributes = document.querySelectorAll(
  //   ".cm-s-default span.cm-attribute"
  // );
  // allAttributes.forEach((attribute) => {
  //   attribute.style.color = "#50fa7b";
  // });
}
