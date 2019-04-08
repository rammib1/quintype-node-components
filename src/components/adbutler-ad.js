import React from "react";
import PropTypes from "prop-types";

export function AdbutlerAd({ adtype, adbutlerConfig, sizes }) {
  const { publisherId, [adtype]: zoneId } = adbutlerConfig;
  const { [adtype]: size } = sizes;

  return (
    <div className="adbutler-wrapper">
      <iframe
        src={`https://servedbyadbutler.com/adserve/;ID=${publisherId};size=${size[0]}x${
          size[1]
        };setID=${zoneId};type=iframe;click=CLICK_MACRO_PLACEHOLDER`}
        width={size[0]}
        height={size[1]}
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
