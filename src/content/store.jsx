
import { createStore, combineReducers } from 'redux';


export const WAITING = Symbol('Waiting');
export const NOT_FOUND = Symbol('Not found');
export const FOUND = Symbol('Found');
export const ERROR = Symbol('Error happened');
export const INVISIBLE = Symbol('Invisible');

const MESSAGE_WAITING = 'Searching now...';
const MESSAGE_NOT_FOUND = 'The album could not find in Spotify.';
const MESSAGE_ERROR = 'Error occured during searching the album.';

const MessageReducer = (state = {}, action) => {
  switch (action.type) {
    case WAITING:
      return MESSAGE_WAITING;
    case NOT_FOUND:
      return MESSAGE_NOT_FOUND;
    case ERROR:
      return MESSAGE_ERROR;
    default:
      return MESSAGE_WAITING;
  }
};

const SpotifyReducer = (state = {}, action) => {
  switch (action.type) {
    case FOUND:
      return { tracks: action.tracks, title: action.title };
    case INVISIBLE:
      return {};
    default:
      return {};
  }
};


const appReducer = combineReducers({ MessageReducer, SpotifyReducer });
export const Store = createStore(appReducer);
