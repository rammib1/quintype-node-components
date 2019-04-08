import React from "react";
import PropTypes from "prop-types";

export function AdbutlerAd({ adtype, adbutlerConfig, sizes }) {
  const { publisherId = "", [adtype]: zoneId = "" } = adbutlerConfig;
  const { [adtype]: [ width, height ] = [] } = sizes;
  const src = `https://servedbyadbutler.com/adserve/;ID=${publisherId};size=${width}x${height};setID=${zoneId};type=iframe;click=CLICK_MACRO_PLACEHOLDER`;

  return (
    <div className="adbutler-wrapper">
      <iframe
        src={src}
        width={width}
        height={height}
        marginWidth="0"
        marginHeight="0"
        hspace="0"
        vspace="0"
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
}

AdbutlerAd.propTypes = {
  adtype: PropTypes.string,
  adbutlerConfig: PropTypes.object,
  sizes: PropTypes.object
};
