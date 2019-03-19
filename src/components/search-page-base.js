import React from 'react';
import get from "lodash/get";
import { getRequest } from './api-client';

import { LoadMoreStoriesManager } from './load-more-stories-base'

export class SearchPageBase extends React.Component {
  search(pageNumber) {
    return getRequest("/api/v1/search", Object.assign(this.props.params, {
      offset: (this.props.storiesPerPage || 20) * pageNumber,
      fields: this.props.fields
    })).json(response => get(response, ["results", "stories"], []));
  }

  render() {
    return React.createElement(LoadMoreStoriesManager, Object.assign({}, this.props.data, {
      template: this.props.template,
      loadStories: (pageNumber) => this.search(pageNumber)
    }));
  }
}
