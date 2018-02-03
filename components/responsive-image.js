import React from "react";
import {connect} from "react-redux";
import {FocusedImage} from "quintype-js";
import {func} from 'prop-types';
import omit from 'lodash/omit';
import emptyWebGif from 'empty-web-gif';

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
    return "//" + props.imageCDN + "/" + image.path(props.aspectRatio, Object.assign({w: size}, props.imgParams));
  }

  return {
    src: generatePath(props.defaultWidth),
    srcSet: props.widths ?  props.widths.map((size) => `${generatePath(size)} ${size}w`).join(",") : undefined,
    key: hashString(props.slug),
  }
}

export class ResponsiveImageBase extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showImage: !context.lazyLoadObserveImage
    }
  }

  render() {
    const imageProps = this.state.showImage ? responsiveProps(this.props) : {src: emptyWebGif};
    return React.createElement("img", Object.assign(imageProps, omit(this.props, USED_PARAMS), {
      ref: dom => this.dom = dom,
      className: this.props.className ? `qt-image ${this.props.className}` : 'qt-image'
    }));
  }

  componentDidMount() {
    this.context.lazyLoadObserveImage && this.context.lazyLoadObserveImage(this.dom, this);
  }

  componentWillUnmount() {
    this.context.lazyLoadUnobserveImage && this.context.lazyLoadUnobserveImage(this.dom, this);
  }

  showImage() {
    this.setState({showImage: true});
  }
}

function mapStateToProps(state) {
  return {
    imageCDN: state.qt.config["cdn-image"]
  };
}

export const ResponsiveImage = connect(mapStateToProps, {})(ResponsiveImageBase);

export class LazyLoadImages extends React.Component {
  constructor(props) {
    super(props);
    this.observedItems = [];
  }

  componentDidMount() {
    this.observer = new global.IntersectionObserver((entries) => this.onObservation(entries), {
      rootMargin: this.props.margin || "500px",
      threshold: 0
    })
    this.observedItems.forEach(([dom, component]) => this.observer.observe(dom));
  }

  onObservation(entries) {
    entries
      .filter(entry => entry.isIntersecting)
      .map(entry => entry.target)
      .forEach(dom => {
        const index = this.observedItems.findIndex(x => x[0] == dom);
        if(index > -1) {
          const component = this.observedItems[index][1];
          component.showImage();
          this.unregister(dom, component);
        }
      });
  }

  register(dom, component) {
    if(!dom)
      return;

    this.observedItems.push([dom, component]);
    this.observer && this.observer.observe(dom);
  }

  unregister(dom, component) {
    if(!dom)
      return;

    const index = this.observedItems.findIndex(x => x[0] == dom);

    if (index > -1) {
      this.observedItems.splice(index, 1);
      this.observer && this.observer.unobserve(dom);
    }
  }

  componentWillUnmount() {
    this.observer && this.observer.disconnect();
  }

  getChildContext() {
    return {
      lazyLoadObserveImage: (dom, component) => this.register(dom, component),
      lazyLoadUnobserveImage: (dom, component) => this.unregister(dom, component)
    }
  }

  render() {
    return this.props.children;
  }
}

ResponsiveImageBase.contextTypes = {
  lazyLoadObserveImage: func,
  lazyLoadUnobserveImage: func
}

LazyLoadImages.childContextTypes = {
  lazyLoadObserveImage: func,
  lazyLoadUnobserveImage: func
}
