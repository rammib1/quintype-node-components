import React from 'react';
import {get} from 'lodash';

export class SearchPageBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pageNumber: 1,
      moreStories: []
    };
  }

  stories() {
    return this.props.data.stories.concat(this.state.moreStories);
  }

  loadMore(e) {
    e.preventDefault();
    if(this.state.loading)
      return;
    const pageNumber = this.state.pageNumber;
    this.setState({loading: true, pageNumber: pageNumber + 1}, () => {
      this.search(this.props.data.query, pageNumber).then((stories) => {
        this.setState({
          loading: false,
          moreStories: this.state.moreStories.concat(stories)
        })
      })
    })
  }

  search(query, pageNumber) {
    return superagent.get("/api/v1/search", {
      offset: (this.props.storiesPerPage || 20) * pageNumber, 
      q: query,
      fields: this.props.fields
    }).then(response => get(response.body, ["results", "stories"], []));
  }

  render() {
    const stories = this.stories()
    if (stories.length > 0) {
      return this.props.foundTemplate({
        query: this.props.data.query,
        stories: stories,
        onLoadMore: (e) => this.loadMore(e)
      });
    } else {
      return this.props.notFoundTemplate({
        query: this.props.data.query
      });
    }
  }
}
