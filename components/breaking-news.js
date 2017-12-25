import React from "react";
import {connect} from "react-redux";
import {BREAKING_NEWS_UPDATED} from '../store/actions';

class BreakingNewsBase extends React.Component {
  render() {
    return React.createElement(this.props.view, this.props);
  }

  updateBreakingNews() {
    superagent.get('/api/v1/breaking-news')
      .then(response => this.props.breakingNewsUpdated(response.body.stories));
  }

  componentDidMount() {
    this.interval = global.setInterval(() => this.updateBreakingNews(), this.props.updateInterval || 60000);
    this.updateBreakingNews();
  }

  componentWillUnmount() {
    global.clearInterval(this.interval);
  }
}

function mapStateToProps(state) {
  return {
    breakingNews: state.breakingNews || [],
  }
}

function mapDispatchToProps(dispatch) {
  return {
    breakingNewsUpdated: (stories) => dispatch({type: BREAKING_NEWS_UPDATED, stories: stories})
  };
}

export const BreakingNews = connect(mapStateToProps, mapDispatchToProps)(BreakingNewsBase);