import React from 'react';

import { removeDuplicateStories } from '../utils';
import {get} from 'lodash';

export class LoadMoreStoriesManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pageNumber: 1,
      moreStories: [],
      noMoreStories: false
    };
  }

  stories() {
    return this.props.stories.concat(this.state.moreStories);
  }

  loadMore(e) {
    e.preventDefault();
    if(this.state.loading)
      return;
    const pageNumber = this.state.pageNumber;
    this.setState({loading: true, pageNumber: pageNumber + 1}, () => {
      this.props.loadStories(pageNumber)
        .then(stories => {
          this.setState({
            loading: false,
            moreStories: this.state.moreStories.concat(removeDuplicateStories(this.stories(), stories)),
            noMoreStories: stories.length == 0
          })
      })
    })
  }

  render() {
    const stories = this.stories()
    if (stories.length > 0) {
      return this.props.foundTemplate(Object.assign({}, this.props, {
        stories: stories,
        onLoadMore: (e) => this.loadMore(e),
        loading: this.state.loading,
        noMoreStories: this.state.noMoreStories
      }));
    } else {
      return this.props.notFoundTemplate(this.props);
    }
  }
}

export class LoadMoreStoriesBase extends React.Component {
  loadMoreStories(pageNumber) {
    return superagent.get("/api/v1/stories", Object.assign(this.props.params, {
      offset: (this.props.storiesPerPage || 20) * pageNumber,
      fields: this.props.fields
    })).then(response => get(response.body, ["stories"], []));
  }

  render() {
    return React.createElement(LoadMoreStoriesManager, Object.assign({}, this.props.data, {
      foundTemplate: this.props.foundTemplate,
      notFoundTemplate: this.props.notFoundTemplate,
      loadStories: (pageNumber) => this.loadMoreStories(pageNumber)
    }));
  }
}
