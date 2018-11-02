import React from "react";
import { connect } from "react-redux";
import { FocusedImage } from "quintype-js";
import { func } from "prop-types";
import omit from "lodash/omit";
import emptyWebGif from "empty-web-gif";

const USED_PARAMS = [
  "imageCDN",
  "defaultWidth",
  "widths",
  "imgParams",
  "slug",
  "metadata",
  "aspectRatio",
  "reactTag"
];

// Add the following CSS somewhere: img.qt-image { width: 100%; object-fit: cover; }

function hashString(string) {
  if (!string) return 0;

  var hash = 0;
  var i;
  var chr;
  for (i = 0; i < string.length; i++) {
    hash = (hash << 5) - hash + string.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function responsiveProps(props) {
  const image = new FocusedImage(props.slug, props.metadata);

  function generatePath(size) {
    return (
      "//" +
      props.imageCDN +
      "/" +
      image.path(props.aspectRatio, Object.assign({ w: size }, props.imgParams))
    );
  }

  return {
    src: generatePath(props.defaultWidth),
    srcSet: props.widths
      ? props.widths.map(size => `${generatePath(size)} ${size}w`).join(",")
      : undefined,
    key: hashString(props.slug)
  };
}

export class ResponsiveImageBase extends React.Component {
  constructor(props, context) {
    if (
      process.env.NODE_ENV == "development" &&
      !props.alt &&
      !props.reactTag
    ) {
      global.console &&
        global.console.warn(
          `Image Found without an alt attribute: ${responsiveProps(props).src}`
        );
    }

    super(props, context);
    this.state = {
      showImage: !context.lazyLoadObserveImage
    };
  }

  render() {
    const imageProps = this.state.showImage
      ? responsiveProps(this.props)
      : { src: emptyWebGif };
    return React.createElement(
      this.props.reactTag || "img",
      Object.assign(imageProps, omit(this.props, USED_PARAMS), {
        ref: dom => (this.dom = dom),
        className: this.props.className
          ? `qt-image ${this.props.className}`
          : "qt-image"
      })
    );
  }

  componentDidMount() {
    this.context.lazyLoadObserveImage &&
      this.context.lazyLoadObserveImage(this.dom, this);
  }

  componentWillUnmount() {
    this.context.lazyLoadUnobserveImage &&
      this.context.lazyLoadUnobserveImage(this.dom, this);
  }

  showImage() {
    this.setState({ showImage: true });
  }
}

function mapStateToProps(state) {
  return {
    imageCDN: state.qt.config["cdn-image"]
  };
}

ResponsiveImageBase.contextTypes = {
  lazyLoadObserveImage: func,
  lazyLoadUnobserveImage: func
};

export const ResponsiveImage = connect(
  mapStateToProps,
  {}
)(ResponsiveImageBase);

export const ResponsiveSource = function(props) {
  return React.createElement(
    ResponsiveImage,
    Object.assign(
      {
        reactTag: "source",
        src: false,
        defaultWidth: 1024
      },
      props
    )
  );
};

export function ResponsiveHeroImage(props) {
  return React.createElement(
    ResponsiveImage,
    Object.assign(
      {
        slug: props.story["hero-image-s3-key"],
        metadata: props.story["hero-image-metadata"],
        alt: props.story["headline"]
      },
      omit(props, ["story"])
    )
  );
}
