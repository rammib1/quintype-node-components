import React from "react";
import emptyWebGif from 'empty-web-gif';
import { FocusedImage } from "quintype-js";
import { hashString, USED_PARAMS } from "./image-utils";
import omit from '@babel/runtime/helpers/objectWithoutProperties';

export function GumletImage(props) {
  const { slug, metadata, aspectRatio, imageCDN, imgParams, reactTag, className } = props;
  const image = new FocusedImage(slug, metadata);

  const imageProps = {
    src: emptyWebGif,
    "data-src": "https://" + imageCDN + "/" + image.path(aspectRatio, imgParams),
    key: hashString(slug)
  }

  return React.createElement(reactTag || "img", Object.assign(imageProps, omit(props, USED_PARAMS), {
    className: className ? `qt-image ${className}` : 'qt-image'
  }));
}
