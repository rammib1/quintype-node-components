import React from 'react';
import {connect} from 'react-redux';

import {HAMBURGER_CLICKED} from "../store/actions";

function HamburgerButtonBase({onClick, children}) {
  return <a href="/" onClick={onClick}>{children}</a>;
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: (e) => {
      e.stopPropagation();
      e.preventDefault();
      dispatch({type: HAMBURGER_CLICKED});
    }
  };
}

export const HamburgerButton = connect(state => ({}), mapDispatchToProps)(HamburgerButtonBase);
