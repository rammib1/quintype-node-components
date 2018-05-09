function removeDuplicateStories(existingStories, newStories, keyFn = story => story.id) {
  const existingStoryIds = existingStories.map(keyFn);
  return newStories.filter(story => !existingStoryIds.includes(keyFn(story)));
}

function extractCollections(items) {
  return items.filter(({type}) => type === "collection");
}

function getAssociatedTemplate({"associated-metadata": associatedMetadata}) {
  return associatedMetadata ? associatedMetadata.layout : '';
}

function findTemplateMatch(template, templatesConfig) {
  return templatesConfig.find(templateConfig => templateConfig.name === template);
}

function fillInCollection(collection, story, {"item-limit": itemLimit = 10}) {
  return Object.assign({}, collection, {"items": new Array(itemLimit).fill(story)});
}

function fillInCollections(collections, story, templatesConfig) {
  return collections.map(collection => {
    const { "collection-items": collectionItems = [], collectionData } = collection;
    if (collectionItems.length) {
      return Object.assign(
        {},
        collection,
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
    const { "collection-items": collectionItems = [], collectionData} = collectionStructure;

    if (collectionItems.length) {
      return Object.assign({}, collectionData, {"items": fillInCollections});
    }

    return Object.assign({}, collectionData, {"items": []});
}

function renderCollectionTemplates(collections, templatesConfig, templateMapping) {
  const getTemplate = templateName => templateMapping[templateName]? templateMapping[templateName] : "div";

  const renderTemplatesRecursively = (_collections, _templatesConfig) => _collections.map(collection => {
    const associatedTemplate = getAssociatedTemplate(collection);
    const templateConfig = associatedTemplate && findTemplateMatch(associatedTemplate, _templatesConfig);
    if (templateConfig) {
      if (templateConfig["item-type"] === "collection") {
        return React.createElement(
          getTemplate(templateConfig.name),
          {collection, key: `col-${collection.id}`},
          renderTemplatesRecursively(collection.items, _templatesConfig)
        );
      }

      return React.createElement(
        getTemplate(templateConfig.name),
        {collection, key: `col-${collection.id}`}
      );
    }

    return React.createElement("div", null);
  });

  return renderTemplatesRecursively(collections, templatesConfig);

};

export {
  removeDuplicateStories,
  extractCollections,
  getAssociatedTemplate,
  findTemplateMatch,
  renderCollectionTemplates,
  fillInDataForPreview
};