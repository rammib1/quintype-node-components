import React from "react";
import propTypes from "prop-types";

export class NavigationComponentBase extends React.Component {
  navigateTo(path) {
    global.app.navigateToPage(this.context.store.dispatch, path);
  }
}

NavigationComponentBase.contextTypes = {
  store: propTypes.object
};
