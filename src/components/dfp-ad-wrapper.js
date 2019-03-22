import React from "react";
import PropTypes from "prop-types";
import { createDfpAdComponent } from "./dfp-ad";

export function DfpAdWrapper(props) {
  const { networkId = "", dfpAdConfig = {}, targetingFunc } = props;
  const DfpAd = createDfpAdComponent({
    defaultNetworkID: networkId,
    config: dfpAdConfig,
    targeting: targetingFunc
  });

  return <DfpAd {...props} />;
}

DfpAdWrapper.propTypes = {
  networkId: PropTypes.string,
  dfpAdConfig: PropTypes.object,
  targetingFunc: PropTypes.func
};
