console.log(`popup`);

const inputTheming = document.getElementById("input-theming");
const inputFontSize = document.getElementById("input-font-size");
const btnIncreaseFontSize = document.getElementById("increase-font-size");

// When the button is clicked, run the code
inputTheming.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let url = tab.url;
  const checked = inputTheming.checked;

  if (!isOnWidgetEditorPage(url)) {
    setTimeout(() => {
      inputTheming.checked = false;
    }, 200);

    return;
  }

  if (checked === true) {
    enableTheme(tab);
  } else if (checked === false) {
    disableTheme(tab);
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

  await chrome.scripting.insertCSS({
    files: ["styles/font-resizing.css"],
    target: { tabId: tab.id },
  });

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
  document.documentElement.style.setProperty("--font-size", fontSize + "px");

  document.documentElement.style.setProperty(
    "--line-height",
    fontSize + 4 + "px"
  );
}

async function enableTheme(tab) {
  inputTheming.checked = true;

  // Insert the CSS file when the user turns the extension on
  await chrome.scripting.insertCSS({
    files: ["styles/dracula-editor.css"],
    target: { tabId: tab.id },
  });
  
  await chrome.storage.sync.set({ themeActive: true });
}

async function disableTheme(tab) {
  inputTheming.checked = false;
  
  // Remove the CSS file when the user turns the extension off
  await chrome.scripting.removeCSS({
    files: ["styles/dracula-editor.css"],
    target: { tabId: tab.id },
  });

  await chrome.storage.sync.set({ themeActive: false });
}

function isOnWidgetEditorPage(url) {
  let isWidgetEditorPage = url.includes("id=widget_editor");
  let urlWidgetIdSplit = url.includes("&sys_id=") ? url.split("&sys_id=") : [];
  // let hasWidgetOpenOnEditor = urlWidgetIdSplit[1]?.length >= 32;

  return isWidgetEditorPage;
}

document.addEventListener('DOMContentLoaded', function() {
  initializePopup();
});

async function initializePopup() {
  const { themeActive } = await chrome.storage.sync.get(["themeActive"]);
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (themeActive && isOnWidgetEditorPage(tab.url)) {
    enableTheme(tab);
  } else {
    disableTheme(tab);
  }
}
