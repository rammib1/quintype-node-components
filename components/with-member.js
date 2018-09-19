import React from "react";
import { connect } from "react-redux";
import { getRequest } from './api-client';
import { MEMBER_UPDATED } from '../store/actions';

let loadedMember = false;

export function withMember(Component) {
  class WithMember extends React.Component {
    componentDidMount() {
      if (!loadedMember) {
        loadedMember = true;
        getRequest('/api/v1/members/me')
          .forbidden(() => this.props.memberUpdated(null))
          .unauthorized(() => this.props.memberUpdated(null))
          .json(({ member }) => this.props.memberUpdated(member))
      }
    }

    render() {
      const { memberUpdated, ...props } = this.props;
      return <Component {...props} />;
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(WithMember);
}

function mapStateToProps(state) {
  return {
    member: state.member || null
  }
}

function mapDispatchToProps(dispatch) {
  return {
    memberUpdated: member => dispatch({ type: MEMBER_UPDATED, member }),
    logout: () => getRequest('/api/logout').res(() => dispatch({ type: MEMBER_UPDATED, member: null }))
  };
}