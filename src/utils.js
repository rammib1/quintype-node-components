// FIXME: TEST THIS
export function removeDuplicateStories(existingStories, newStories, keyFn = story => story.id) {
  const existingStoryIds = existingStories.map(keyFn);
  return newStories.filter(story => !existingStoryIds.includes(keyFn(story)));
}

export function getAssociatedTemplate({"associated-metadata": associatedMetadata}) {
  return associatedMetadata ? associatedMetadata.layout : 'default';
}

// FIXME: TEST THIS
export function replaceAllStoriesInCollection(collection, story) {
  const items = (collection.items || []).map(item => {
    if (item.type === "story") {
      return {id: story.id, type: "story", story};
    } else if (item.type === "collection") {
      return replaceAllStoriesInCollection(item, story);
    }
    return item;
  });

  return Object.assign({}, collection, {items});
}

//Helps handle errors with async await pattern

export const awaitHelper = promise => (
    promise
        .then(data => ({ data, error: null }))
        .catch(error => ({ error, data: null }))
);
