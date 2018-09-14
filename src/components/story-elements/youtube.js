import React from "react";
import getYouTubeID from 'get-youtube-id';

let YouTube = null;
let loaderPromise = null;

function loadLibrary(){
  if (loaderPromise === null) {
    loaderPromise = import(/* webpackChunkName: "qtc-react-youtube" */ "react-youtube").then(YT => {
      YouTube = YT.default;
    }).catch(err => {
      console.log('Failed to load react-youtube', err);
      return Promise.reject();
    });
  }

  return loaderPromise;
}

function isLibraryLoaded(){
  return YouTube !== null;
}

export default class StoryElementYoutube extends React.Component {
  constructor(props) {
    super(props);
    this.opts = {
      playerVars: {
        autoplay: 0
      }
    };
  }

  componentDidMount(){
    loadLibrary().then(() => this.forceUpdate());
  }

  render() {
    if (isLibraryLoaded()) {
      return React.createElement(YouTube, {videoId: getYouTubeID(this.props.element.url), opts:this.opts });    
    }

    return <div></div>;
  }
}