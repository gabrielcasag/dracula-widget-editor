const manifest = chrome.runtime.getManifest();
const versionString = " v" + manifest.version;
document.getElementById("version").innerText = versionString;
