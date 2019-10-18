import {connect} from "react-redux";
import React from "react";
import { ThumborImage } from "./impl/thumbor-image";
import { string, arrayOf, number, object } from 'prop-types';

function mapStateToProps(state) {
  return {
    imageCDN: state.qt.config["cdn-image"]
  };
}

function ResponsiveImageBase(props) {
  return React.createElement(ThumborImage, props);
}

ResponsiveImageBase.propTypes = {
  /** The Path to the image, relative to images.assettype.com. Usually publisher/yyyy/mm/<rand>/image-name.type */
  slug: string.isRequired,

  /** The image metadata as returned by the editor. Usually has width, height and focus point */
  metadata: object,

  /** The alt text for this image */
  alt: string.isRequired,

  /** The aspect ratio of the image output. Ex: [16, 9] */
  aspectRatio: arrayOf(number),

  /** The default width for the image, in case the browser does not support srcset */
  defaultWidth: number,

  /** The list of available widths */
  widths: arrayOf(number),

  /** Hints for the browser to choose the best size. See <a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Resolution_switching_Different_sizes">Syntax</a> */
  sizes: string,

  /** Other parameters to pass to the image resizing engine */
  imgParams: object
};

/**
 * This component takes an image, and resizes it to the correct aspect ratio using imgix or thumbor.
 *
 * See the tutorial {@tutorial using-responsive-image} for an in depth look at using this component
 *
 * Example
 * ```javascript
 * import { ResponsiveImage } from '@quintype/components';
 *
 * <figure className="story-grid-item-image qt-image-16x9">
 *   <ResponsiveImage slug={props.story["hero-image-s3-key"]}
 *     metadata={props.story["hero-image-metadata"]}
 *     alt={props.story['headline']}
 *     aspectRatio={[16,9]}
 *     defaultWidth={480} widths={[250,480,640]}
 *     sizes="(max-width: 500px) 98vw, (max-width: 768px) 48vw, 23vw"
 *     imgParams={{auto:['format', 'compress']}}/>
 * </figure>
 * ```
 * @component
 * @category Images
 * @tutorial using-responsive-image
 */
export const ResponsiveImage = connect(mapStateToProps, {})(ResponsiveImageBase);
