/* global chrome, window, document, fetch */

import { ROOT, S3URL } from './constant';
import render from './components.jsx';
import { Store, NOT_FOUND, FOUND, ERROR, INVISIBLE } from './store.jsx';
import searchSpotify from './spotify';


let originPattern = null;
let isInitialized = false;
let beforeURL = null;
let rootElement = null;

const cssURL = chrome.extension.getURL('content.css');

const injectMainDiv = () => {
  const div = document.createElement('div');
  div.id = ROOT;
  div.className = ROOT;
  document.body.appendChild(div);
  rootElement = div;
};

const injectScript = (name) => {
  const script = document.createElement('script');
  script.src = `${S3URL}${name}.js`;
  document.body.appendChild(script);
};

const injectCSS = () => {
  const link = document.createElement('link');
  link.href = cssURL;
  link.type = 'text/css';
  link.rel = 'stylesheet';
  document.getElementsByTagName('head')[0].appendChild(link);
};

const isOurTargetURL = ({ url, urlPattern }) => {
  const urlRegExp = new RegExp(urlPattern);
  return urlRegExp.exec(url);
};

/**
 * This method is called when the script which is embed in a page find out information of artist and title from DOM of the page.
 * @param {Object} data It contains information of artist name and title.
 * @param {String} origin It is source of host of the message. We have to check origin because observing message gets all message in browser.
 */
const processEmbed = ({ data, origin }) => {
  const { artist, title } = data;
  if (!originPattern.exec(origin) || !artist || !title) {
    return undefined;
  }

  (async function makeURLForEmbed() {
    return searchSpotify(data);
  }())
  .then((strTracks) => {
    if (strTracks === null) {
      return Store.dispatch({ type: NOT_FOUND });
    }
    return Store.dispatch({ type: FOUND, tracks: strTracks, title });
  })
  .catch((err) => {
    console.error(err.stack);
    Store.dispatch({ type: ERROR });
  });
  return undefined;
};

/**
 * This function receives message from background script when DOMContentLoaded or url is changed.
 * It determines DOMContentLoaded or another by checking value in the parameter.
 * @param {Object} param
 */
const onMessageFromBG = (param) => {
  if (!param.urlPattern) {
    return;
  }

  const { url, name, originPatternStr } = param;
  const isMatchURL = isOurTargetURL(param);

  if (!isMatchURL) {
    if (isInitialized) {
      rootElement.style.display = 'none';
      Store.dispatch({ type: INVISIBLE });
    }
    return;
  } else if (isInitialized && isMatchURL && beforeURL !== url) {
    beforeURL = url;
    const loc = window.location;
    rootElement.style.display = 'block';
    window.postMessage('UPDATED', `${loc.protocol}//${loc.host}`);
    return;
  }

  isInitialized = true;
  beforeURL = url;

  injectScript(name);
  injectCSS();

  window.addEventListener('message', processEmbed);

  originPattern = new RegExp(originPatternStr);
  /* the program values this logic only a time. It is when message receives by DOMContentLoaded. */
  injectMainDiv();
  render();
};

/*
  This is for waiting messages from script tag which search artist's name and the title.
  It is because I will adapt other web media and I will find out different selectors then.
 */
chrome.runtime.onMessage.addListener(onMessageFromBG);
