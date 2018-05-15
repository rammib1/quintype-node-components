import React from 'react';

import {getAssociatedTemplate} from "../utils";

function StoryNotImplemented() {
  return <div data-comment="Story Template Not Implemented" />;
}

function CollectionNotImplemented() {
  return <div data-comment="Collection Template Not Implemented" />;
}

// Pass this the HomePage Collection
export function Collection({className, collection, collectionTemplates = () => CollectionNotImplemented, storyTemplates = () => StoryNotImplemented, interstitial = () => undefined}) {
  const children = collection.items.map((collectionItem, index) => {
    switch(collectionItem.type) {
      case "collection":
      return React.createElement(collectionTemplates(getAssociatedTemplate(collectionItem), index), {
        key: `${index}-${collectionItem.id}`,
        collection: collectionItem,
        metadata: collectionItem["associated-metadata"] || {},
        renderCollection: (props) => React.createElement(Collection, props)
      });

      case "story":
      return React.createElement(storyTemplates(index), {
        key: `${index}-${collectionItem.id}`,
        story: collectionItem.story,
        metadata: collectionItem["associated-metadata"] || {}
      });

      default: return <div data-comment={`${collectionItem.type} not implemented`}/>
    }
  }).reduce((arr, v, i) => arr.concat([v, interstitial(i)]), []);

  return React.createElement("div", {className}, children);
}