/* global document */

import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import React from 'react';
import { Store } from './store.jsx';
import { ROOT } from './constant';

const Message = ({ message }) => (
  <div className="spotify_on_media_message">{message}</div>
);

const MessageBox = connect(
  state => ({ message: state.MessageReducer })
)(Message);


const Spotify = ({ title, tracks }) => {
  if (!tracks) {
    return null;
  }
  const spotifyURL = `https://embed.spotify.com/?uri=spotify:trackset:${title}:${tracks}`;
  return (
    <iframe
      id="spotify_on_media_iframe"
      src={spotifyURL}
      width="300"
      height="380"
      frameBorder="0"
      allowTransparency="true"
    >
      spotify
    </iframe>
  );
};

const SpotifyEmbed = connect(
  state => state.SpotifyReducer
)(Spotify);


const App = () => (
  <div>
    <MessageBox />
    <SpotifyEmbed />
  </div>
);

export default () => {
  ReactDOM.render(
    <Provider store={Store}>
      <App />
    </Provider>,
    document.getElementById(ROOT),
  );
};
