import React from 'react';

import {extractCollections, getAssociatedTemplate} from "../utils";

function Collection({template, collection, templatesMapping}) {
  const getTemplate = templateName => templatesMapping[templateName]? templatesMapping[templateName] : "div";

  const renderTemplatesRecursively = (items) => {
    const collectionTypeItems = extractCollections(items);
    if (collectionTypeItems.length === 0) return null;

    return collectionTypeItems.map(_collection => React.createElement(
      getTemplate(getAssociatedTemplate(_collection)),
      {collection: _collection, key: `col-${_collection.id}`},
      renderTemplatesRecursively(_collection.items || [])
    ));
  };

  return React.createElement(
    template,
    collection,
    renderTemplatesRecursively(collection.items || [])
  );
};

export {Collection};