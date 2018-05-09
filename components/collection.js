import React from 'react';

import {extractCollections, getAssociatedTemplate, findTemplateMatch} from "../utils";

function Collection({template, collection, templatesConfig, templatesMapping}) {
  const getTemplate = templateName => templatesMapping[templateName]? templatesMapping[templateName] : "div";

  const renderTemplatesRecursively = (_collections, _templatesConfig) => _collections.map(collection => {
    const associatedTemplate = getAssociatedTemplate(collection);
    const templateConfig = associatedTemplate && findTemplateMatch(associatedTemplate, _templatesConfig);
    if (templateConfig) {
      if (templateConfig["item-type"] === "collection") {
        return React.createElement(
          getTemplate(associatedTemplate),
          {collection, key: `col-${collection.id}`},
          renderTemplatesRecursively(collection.items, _templatesConfig)
        );
      }
    }

    return React.createElement(
      getTemplate(associatedTemplate),
      {collection, key: `col-${collection.id}`}
    );
  });

  const collections = extractCollections(collection.items);
  return React.createElement(
    template,
    collection,
    collections.length > 0? renderTemplatesRecursively(collections, templatesConfig) : null
  );
};

export {Collection};