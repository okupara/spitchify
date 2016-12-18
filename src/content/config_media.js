/* global fetch */

import _ from 'lodash';
import { S3URL } from './constant';

let config = null;

/**
 * This function loads configure file and the file is written config of individual media.
 */
const load = async () => {
  const option = { method: 'GET' };
  const d = new Date();

  const res = await fetch(`${S3URL}app.json?d=${d.getTime()}`, option);
  if (res.status < 200 || res.status >= 400) {
    throw new Error('HTTP status code is not 2xx or 3xx');
  }
  config = await res.json();
};

/**
 * This function checks either url which is seen by user is our targets or not.
 * @param {String} url
 * @return {Object} if the url is not our targets, it returns null.
 */
const checkTarget = (url) => {
  const mediaList = config.mediaList;
  const mediaIndex = _.findIndex(mediaList, (m) => {
    const r = new RegExp(m.originPattern);
    return r.exec(url);
  });

  if (mediaIndex < 0) {
    return null;
  }
  return mediaList[mediaIndex];
};


export default { load, checkTarget };
