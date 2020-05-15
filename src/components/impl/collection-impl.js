import React from 'react';
import loadable from '@loadable/component'
import { getAssociatedTemplate } from "../../utils";

export function StoryNotImplemented() {
  return <div data-comment="Story Template Not Implemented" />;
}

export function CollectionNotImplemented() {
  return <div data-comment="Collection Template Not Implemented" />;
}

export function renderCollectionItem(collectionItem, index, collectionTemplates, storyTemplates, otherProps = {}) {
  switch (collectionItem.type) {
    case "collection":
      if(otherProps.isLoadedDynamically) {
        const Component = loadable(() => collectionTemplates(getAssociatedTemplate(collectionItem), index));
        return React.createElement(Component, {
          key: `${index}-${collectionItem.id}`,
          index: index,
          collection: collectionItem,
          metadata: collectionItem["associated-metadata"] || {},
          ...otherProps
        });
      }
      
      return React.createElement(collectionTemplates(getAssociatedTemplate(collectionItem), index), {
        key: `${index}-${collectionItem.id}`,
        index: index,
        collection: collectionItem,
        metadata: collectionItem["associated-metadata"] || {},
        ...otherProps
      });

    case "story":
      return React.createElement(storyTemplates(index), {
        key: `${index}-${collectionItem.id}`,
        index: index,
        story: collectionItem.story,
        metadata: collectionItem["associated-metadata"] || {},
        ...otherProps
      });

    default: return <div data-comment={`${collectionItem.type} not implemented`} />
  }
}
