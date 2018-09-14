import React from "react";
import getYouTubeID from 'get-youtube-id';

let YouTube = null;

function loadLibrary(){
  return import(/* webpackChunkName: "qtc-react-youtube" */ "react-youtube")
    .then(YT => {
      YouTube = YT.default;
    });
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