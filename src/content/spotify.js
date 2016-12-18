/* global fetch */

import _ from 'lodash';

const SEARCH_URL = 'https://api.spotify.com/v1/search?type=album&q=';
const ALBUM_URL = 'https://api.spotify.com/v1/albums/';

const PARAM_API = { method: 'GET' };
const cache = {};

/**
 * This function make a query which gives Spotify API from artist name and title
 * @param {String} artist
 * @param {String} title
 * @return {String}
 */
const makeQueryForSearching = ({ artist, title }) => {
  const r = /(\s+)/g;
  const a = artist.replace(r, '+');
  const t = title.replace(r, '+');
  return `${a}+${t}`.toLowerCase();
};

const searchAlbum = async (query) => {
  const response = await fetch(`${SEARCH_URL}${query}`, PARAM_API);
  const searchedJson = await response.json();
  const items = _.get(searchedJson, 'albums.items');
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }
  return items[0];
};

/**
 * This function retrieves all tracks in the album.
 * It is because that Spotify Embed seems having bugs when we give an album url to src of iframe.
 * That is why we use "Multiple Track Mode".
 * @param {String} id an album id in Spotify.
 * @return {Array} information of all of trucks in the album.
 */
const searchTracks = async (id) => {
  const response = await fetch(`${ALBUM_URL}${id}`);
  const albumObj = await response.json();
  const albumTracks = _.get(albumObj, 'tracks.items');

  if (!Array.isArray(albumTracks)) {
    throw new Error('Something wrong in result of album api...');
  }
  if (albumTracks.length === 0) {
    return null;
  }
  return albumTracks;
};

/**
 * This function makes url of "Multiple Track Mode".
 * @param {Array} tracks array of all of track's information.
 * @return {String} comma separated String that includes all of tracks' ids.
 */
const makeTracksUrlForEmbed = (tracks) => {
  const trackIDs = tracks.map(track => track.id);
  return trackIDs.join(',');
};

/**
 *
 */
export default async (param) => {
  const query = makeQueryForSearching(param);
  if (cache[query]) {
    return cache[query];
  }
  const album = await searchAlbum(query);
  if (!album) {
    return null;
  }
  const tracks = await searchTracks(album.id);
  if (!tracks) {
    return null;
  }
  const strTrackIDs = makeTracksUrlForEmbed(tracks);
  cache[query] = strTrackIDs;
  return strTrackIDs;
};
