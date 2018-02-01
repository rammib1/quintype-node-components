import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import {FocusedImage} from "quintype-js";
import {string} from 'prop-types';

const USED_PARAMS = ["imageCDN","defaultWidth","widths","imgParams","slug","metadata","aspectRatio"];

// Add the following CSS somewhere: img.qt-image { width: 100%; object-fit: cover; }

function hashString(string) {
  if(!string)
    return 0;

  var hash = 0, i, chr;
  for (i = 0; i < string.length; i++) {
    hash  = ((hash << 5) - hash) + string.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function responsiveProps(props) {
  const image = new FocusedImage(props.slug, props.metadata);

  function generatePath(size) {
    return "//" + props.imageCDN + "/" + image.path(props.aspectRatio, _.merge({w: size}, props.imgParams));
  }

  return {
    src: generatePath(props.defaultWidth),
    srcSet: props.widths ?  _(props.widths).map((size) => `${generatePath(size)} ${size}w`).join(",") : undefined,
    key: hashString(props.slug),
  }
}

export function ResponsiveImageBase(props, context) {
  const imageProps = context.lazyLoad ? {src: context.lazyLoad} : responsiveProps(props);
  return React.createElement("img", _(imageProps)
                                      .merge(props)
                                      .merge({className: props.className ? `qt-image ${props.className}` : 'qt-image'})
                                      .omit(USED_PARAMS)
                                      .value());
}

function mapStateToProps(state) {
  return {
    imageCDN: state.qt.config["cdn-image"]
  };
}

export const ResponsiveImage = connect(mapStateToProps, {})(ResponsiveImageBase);

export class LazyLoadImages extends React.Component {
  getChildContext() {
    return {
      lazyLoad: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    }
  }

  render() {
    return this.props.children;
  }
}

ResponsiveImageBase.contextTypes = {
  lazyLoad: string
}

LazyLoadImages.childContextTypes = {
  lazyLoad: string
}
