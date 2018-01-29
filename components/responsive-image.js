import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import {FocusedImage} from "quintype-js";

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
    className: props.className ? `qt-image ${props.className}` : 'qt-image',
    src: generatePath(props.defaultWidth),
    srcSet: props.widths ?  _(props.widths).map((size) => `${generatePath(size)} ${size}w`).join(",") : undefined,
    key: hashString(props.slug),
  }
}

export function ResponsiveImageBase(props) {
  return React.createElement("img", _(responsiveProps(props)).merge(props).omit(USED_PARAMS).value());
}

function mapStateToProps(state) {
  return {
    imageCDN: state.qt.config["cdn-image"]
  };
}

export const ResponsiveImage = connect(mapStateToProps, {})(ResponsiveImageBase);
