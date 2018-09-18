import React from "react";
import {connect} from "react-redux";
import {getRequest} from './api-client';
import {MEMBER_UPDATED} from '../store/actions';

let loadedMember = false;

class LoggedInBase extends React.Component {
  componentDidMount() {
    if(!loadedMember) {
      loadedMember = true;
      getRequest('/api/v1/members/me')
        .json(({member}) => this.props.memberUpdated(member))
    }
  }

  render() {
    const {member, loggedInView, loggedOutView, ...props} = this.props;
    if(member) 
      return React.createElement(loggedInView, {member: member, ...props})
    else
      return React.createElement(loggedOutView, props);
  }
}

function mapStateToProps(state) {
  return {
    member: state.member || null,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    memberUpdated: (member) => dispatch({type: MEMBER_UPDATED, member: member})
  };
}

export const LoggedIn = connect(mapStateToProps, mapDispatchToProps)(LoggedInBase);