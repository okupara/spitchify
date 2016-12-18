/* global fetch, chrome */

import configMedia from './content/config_media';

// Fields are expected an object consisted of tabid(key) and url(value).
const tabs = {};

/**
 * This function is invoked when background.js detects DOMContentLoad and a change of url.
 * @param {Object} details
 */
const sendMessageToTab = (details) => {
  const { tabId, url } = details;
  const target = configMedia.checkTarget(url);

  if (!target) {
    return null;
  }

  tabs[tabId] = url;
  chrome.tabs.sendMessage(tabId, { ...target, url });
  return undefined;
};

/**
 * This function goes and gets a config json from s3 at first.
 * After that, sends message to tabs and those process content actions.
 */
(async function getConfigJson() {
  await configMedia.load();
}())
.then(() => {
  // config = data;
  chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    const url = tabs[details.tabId];
    if (url === details.url) {
      return;
    }
    tabs[details.tabId] = url;
    sendMessageToTab(details);
  });
  chrome.webNavigation.onDOMContentLoaded.addListener(sendMessageToTab);
})
.catch(err => console.error(err.stack));
