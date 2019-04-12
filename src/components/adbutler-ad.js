import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";


export class AdbutlerAd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: []
    }
    this.getSize = this.getSize.bind(this);
  }

  componentDidMount() {
    const size = this.getSize();
    this.setState({
      size: size
    })
  }

  getSize() {
    const { adtype, sizes } = this.props;
    const { [adtype]: sizeMap } = sizes;
    const screenWidth = get(window, ["screen", "width"], 992);

    if (screenWidth < 448) {
      return sizeMap["mobile"];
    } else {
      return sizeMap["desktop"];
    }
  }

  render() {
    const { adtype, adbutlerConfig } = this.props;
    const { publisherId = "", [adtype]: zoneId = "" } = adbutlerConfig;
    const [ width, height ] = this.state.size;
    const src = `https://servedbyadbutler.com/adserve/;ID=${publisherId};size=${width}x${height};setID=${zoneId};type=iframe;click=CLICK_MACRO_PLACEHOLDER`;
    const hasSize = this.state.size.length;

    return (
      <div className="adbutler-wrapper">
        { hasSize && <iframe
          src={src}
          width={width}
          height={height}
          marginWidth="0"
          marginHeight="0"
          hspace="0"
          vspace="0"
          frameBorder="0"
          scrolling="no"
        /> }
      </div>
    );
  }
}

AdbutlerAd.propTypes = {
  adtype: PropTypes.string,
  adbutlerConfig: PropTypes.object,
  sizes: PropTypes.object
};
