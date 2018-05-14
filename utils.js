function removeDuplicateStories(existingStories, newStories, keyFn = story => story.id) {
  const existingStoryIds = existingStories.map(keyFn);
  return newStories.filter(story => !existingStoryIds.includes(keyFn(story)));
}

function getAssociatedTemplate({"associated-metadata": associatedMetadata}) {
  return associatedMetadata ? associatedMetadata.layout : '';
}

function extractCollections(items) {
  return items.filter(({type}) => type === "collection");
}

function fillInCollection(collection, story) {
    if (collection && collection.items && collection.items.length) {
      const items = collection.items.map(item => {
        if (item.type === "story") {
          return {id: story.id, type: "story", story};
        } else if (item.type === "collection") {
          return fillInCollection(item, story);
        }
        return item;
      });

      return Object.assign({}, collection, {items});
    }

    return collection;
}

export {
  removeDuplicateStories,
  extractCollections,
  getAssociatedTemplate,
  fillInCollection
};