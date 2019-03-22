import React from "react";
import PropTypes from "prop-types";
import { createDfpAdComponent } from "./dfp-ad";

export function DfpAdWrapper(props) {
  const { networkId, adConfig, targetingFunc } = props;
  const DfpAd = createDfpAdComponent({
    defaultNetworkID: networkId,
    config: adConfig,
    targeting: targetingFunc
  });

  return <DfpAd {...props} />;
}

DfpAdWrapper.propTypes = {
  networkId: PropTypes.string,
  adConfig: PropTypes.object,
  targetingFunc: PropTypes.func
};
