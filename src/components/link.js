import React from "react";
import {connect} from "react-redux";

function LinkBase(props) {
  const {navigateTo, externalLink, callback, ...otherProps} = props;

  return React.createElement("a", Object.assign(otherProps, {
    onClick(e) {
      if(global.disableAjaxLinks)
        return;

      if(e.ctrlKey || e.metaKey || e.shiftKey)
        return;

      e.preventDefault();
      e.stopPropagation();

      if(externalLink) {
        global.open(externalLink, "_blank");
      }
      else {
        navigateTo(props.href);
      }

      typeof callback === 'function' && callback(e);
    }
  }));
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    navigateTo: function(url) {
      global.app.navigateToPage(dispatch, url);
    }
  };
}

export const Link = connect(mapStateToProps, mapDispatchToProps)(LinkBase);
