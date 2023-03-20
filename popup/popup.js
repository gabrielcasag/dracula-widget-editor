console.log(`popup`);

const inputTheming = document.getElementById("input-theming");
const inputFontSize = document.getElementById("input-font-size");
const btnIncreaseFontSize = document.getElementById("increase-font-size");

// When the button is clicked, run the code
inputTheming.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const checked = inputTheming.checked;

  //verify if the user is on widget editor page and has some widget open
  let url = tab.url;
  let isWidgetEditorPage = url.includes("id=widget_editor");
  let urlWidgetIdSplit = url.includes("&sys_id=") ? url.split("&sys_id=") : [];
  let hasWidgetOpenOnEditor = urlWidgetIdSplit[1]?.length >= 32;

  if (!isWidgetEditorPage || !hasWidgetOpenOnEditor) {
    setTimeout(() => {
      inputTheming.checked = false;
    }, 200);

    return;
  }

  if (checked === true) {
    // Insert the CSS file when the user turns the extension on
    await chrome.scripting.insertCSS({
      files: ["dracula-editor.css"],
      target: { tabId: tab.id },
    });
  } else if (checked === false) {
    // Remove the CSS file when the user turns the extension off
    await chrome.scripting.removeCSS({
      files: ["dracula-editor.css"],
      target: { tabId: tab.id },
    });
  }

  await chrome.storage.sync.set({
    themeActive: checked,
  });
});

btnIncreaseFontSize.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  //verify if the user is on widget editor page and has some widget open
  let url = tab.url;
  let isWidgetEditorPage = url.includes("id=widget_editor");
  let urlWidgetIdSplit = url.includes("&sys_id=") ? url.split("&sys_id=") : [];
  let hasWidgetOpenOnEditor = urlWidgetIdSplit[1]?.length >= 32;

  if (!isWidgetEditorPage || !hasWidgetOpenOnEditor) {
    return;
  }

  let fontSize = parseInt(inputFontSize.value);

  if (!fontSize || fontSize <= 0) {
    inputFontSize.required = true;
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setFontSize,
    args: [fontSize],
  });
});

async function setFontSize(fontSize) {
  var lines = document.querySelectorAll(
    ".code-container .CodeMirror .CodeMirror-line"
  );

  for (var i = 0; i < lines.length; i++) {
    lines[i].style.fontSize = `${fontSize}px`;
  }
}
