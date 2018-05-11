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

function fillInCollection(collection, story, {"item-limit": itemLimit = 10}) {
  return Object.assign({}, collection, {"items": new Array(itemLimit).fill(story)});
}

function fillInCollections(collections, story, templatesConfig) {
  return collections.map(collection => {
    const { "items": collectionItems = [], ...collectionData } = collection;
    if (collectionItems.length) {
      return Object.assign(
        {},
        collectionData,
        {"items": fillInCollections(collectionItems, story, templatesConfig)}
      );
    }

    return fillInCollection(
      collectionData,
      story,
      findTemplateMatch(getAssociatedTemplate(collection), templatesConfig)
    );
  });
}

function fillInDataForPreview(collectionStructure, story, templatesConfig) {
    const { "items": collectionItems = [], ...collectionData} = collectionStructure;

    if (collectionItems.length) {
      return Object.assign({}, collectionData, {"items": fillInCollections(collectionItems, story, templatesConfig)});
    }

    return Object.assign({}, collectionData, {"items": []});
}

export {
  removeDuplicateStories,
  extractCollections,
  getAssociatedTemplate
};