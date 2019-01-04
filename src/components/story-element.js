import React from "react";
import classNames from "classnames";
import JSEmbed from './story-elements/jsembed';
import StoryElementYoutube from './story-elements/youtube';
import { ResponsiveImage } from "./responsive-image";
import Polltype from './story-elements/polltype';
import {Table} from './story-elements/table';
import { Link } from './link';

function StoryElementText({element = {},externalLink}) {
  let text = element.text || '';
  if(externalLink){
    text = element.text.replace(/<a/g,'<a target="_blank"');
  }
  return React.createElement("div", {dangerouslySetInnerHTML: {__html: text}});
}

function StoryElementAlsoRead({element, story}) {
  const storyUrl = story['linked-stories'] && '/' + story['linked-stories'][element.metadata['linked-story-id']]['slug'];
  const linkProps = { className: "story-element-text-also-read__link",
                      href: storyUrl
                    };
  return React.createElement("h3", {},
    React.createElement("span", { className: "story-element-text-also-read__label" }, "Also read: "),
    React.createElement(Link, linkProps, element.text)
  );
}

function StoryElementImage({element, story = {}, imageWidths, imageDefaultWidth}) {
  return React.createElement("figure", {},
    React.createElement(ResponsiveImage, {
      slug: element["image-s3-key"],
      metadata: element["metadata"],
      aspectRatio: null,
      defaultWidth: imageDefaultWidth || 640,
      widths: imageWidths || [360,640,1200],
      imgParams: {auto:['format', 'compress']},
      alt: element.title || story.headline
    }),
    element.title ? React.createElement("figcaption", {dangerouslySetInnerHTML: {__html: element.title}, className: "story-element-image-title"}) : undefined,
    element['image-attribution'] ? React.createElement("figcaption", {dangerouslySetInnerHTML: {__html: element['image-attribution']}, className: "story-element-image-attribution"}) : undefined
  );
}

function StoryElementTitle({element}) {
  return React.createElement("h2", {}, element.text);
}

function StoryElementSoundCloud({element}) {
  return React.createElement("iframe", { 'src': element['embed-url'], 'width': '100%'} );
}

function StoryElementJsembed({element}) {
  return React.createElement(JSEmbed, {embedJS: element['embed-js'], id: element['id']});
}

function StoryElementPolltype({element}) {
  return React.createElement(
    Polltype,
    {id: element['polltype-id']}
  );
}

function StoryElementTable({element}) {
  return React.createElement(Table, { id: element.id, data: element.data, hasHeader: element.metadata['has-header']});
}

function StoryElementFile({element}) {
  return React.createElement(React.Fragment, null,
            React.createElement("div", {className: "story-element-file__title"}, element["file-name"]),
            React.createElement("a", {className: "story-element-file__link", href: element.url, download: true}, 'download'))
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
  "also-read": StoryElementAlsoRead,
  "file": StoryElementFile,
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
        {...elementProps},
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
