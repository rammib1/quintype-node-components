import React from "react";
import classNames from "classnames";
import getYouTubeID from 'get-youtube-id';
import YouTube from 'react-youtube';
import JSEmbed from './story-elements/jsembed';
import { ResponsiveImage } from "./responsive-image";
import Polltype from './story-elements/polltype';
import {Table} from './story-elements/table';
import { Link } from './link';

function StoryElementText({element: storyElement}) {
  return React.createElement("div", {dangerouslySetInnerHTML: {__html: storyElement.text}});
}

function StoryElementAlsoRead({element: storyElement, story}) {
  const storyUrl = story['linked-stories'] && '/' + story['linked-stories'][storyElement.metadata['linked-story-id']]['slug'];
  const linkProps = { className: "story-element-text-also-read__link",
                      href: storyUrl
                    };
  return React.createElement("h3", {},
    React.createElement("span", { className: "story-element-text-also-read__label" }, "Also read: "),
    React.createElement(Link, linkProps, storyElement.text)
  );
}

function StoryElementImage({element: storyElement}) {
  return React.createElement("figure", {},
    React.createElement(ResponsiveImage, {
      slug: storyElement["image-s3-key"],
      metadata: storyElement["metadata"],
      aspectRatio: null,
      defaultWidth: 480,
      widths: [250,480,640],
      imgParams: {auto:['format', 'compress']}
    }),
    storyElement.title ? React.createElement("figcaption", {dangerouslySetInnerHTML: {__html: storyElement.title}, className: "story-element-image-title"}) : undefined,
    storyElement['image-attribution'] ? React.createElement("figcaption", {dangerouslySetInnerHTML: {__html: storyElement['image-attribution']}, className: "story-element-image-attribution"}) : undefined
  );
}

function StoryElementTitle({element: storyElement}) {
  return React.createElement("h2", {}, storyElement.text);
}

function StoryElementSoundCloud({element: storyElement}) {
  return React.createElement("iframe", { 'src': storyElement['embed-url'], 'width': '100%'} );
}

function StoryElementJsembed({element: storyElement}) {
  return React.createElement(JSEmbed, {embedJS: storyElement['embed-js'], id: storyElement['id']});
}

function StoryElementYoutube({element: storyElement}) {
  const opts = {
    playerVars: {
      autoplay: 0
    }
  };
  return React.createElement(YouTube, {videoId: getYouTubeID(storyElement.url), opts:opts });
}

function StoryElementPolltype({element: storyElement}) {
  return React.createElement(
    Polltype,
    {id: storyElement['polltype-id']}
  );
}

function StoryElementTable({element: storyElement}) {
  return React.createElement(Table, { id: storyElement.id, data: storyElement.data, hasHeader: storyElement.metadata['has-header']});
}

// FIXME MISSING: composite
// TODO: Can also support various subtypes (though not needed potentially)

const DEFAULT_TEMPLATES = {
  "text": StoryElementText,
  "image": StoryElementImage,
  "title": StoryElementTitle,
  "youtube-video": StoryElementYoutube,
  "soundcloud-audio": StoryElementSoundCloud,
  "jsembed": StoryElementJsembed,
  "polltype": StoryElementPolltype,
  "table": StoryElementTable,
  "also-read": StoryElementAlsoRead
};

class StoryElementBase extends React.Component {
  template() {
    const storyElement = this.props.element;
    const templates = Object.assign({}, DEFAULT_TEMPLATES, this.props.templates);
    return templates[storyElement.subtype] || templates[storyElement.type] || "div";
  }

  storyElement() {
    return this.props.element;
  }

  render() {
    const storyElement = this.props.element;
    const typeClassName = `story-element-${storyElement.type}`;
    const subtypeClassName = `story-element-${storyElement.type}-${storyElement.subtype}`;

    const storyElementTemplate = this.template();

    const { renderTemplates = {}, ...elementProps } = this.props;
    const renderTemplate = renderTemplates[storyElement.subtype] || renderTemplates[storyElement.type];

    return React.createElement("div", {
      className: classNames({
        "story-element": true,
        [typeClassName]: true,
        [subtypeClassName]: !!storyElement.subtype
      })
    }, (renderTemplate?
      React.createElement(
        renderTemplate,
        Object.assign({}, {element: storyElement}),
        React.createElement(storyElementTemplate, Object.assign({}, elementProps))
      ) : React.createElement(storyElementTemplate, Object.assign({}, elementProps)))
    )
  }
}

export class StoryElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {crashed: false};
  }

  componentDidCatch(error, stack) {
    this.setState({
      crashed: true,
      error: error
    });
    console && console.error(`Caught Exception: ${error && error.message}`)
  }

  render() {
    if(this.state.crashed) {
      return <div className="story-element story-element-crashed" />;
    } else {
      return React.createElement(StoryElementBase, this.props);
    }
  }
}

export const STORY_ELEMENT_TEMPLATES = DEFAULT_TEMPLATES;
