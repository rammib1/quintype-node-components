import React from "react";
import {createDfpAdComponent} from "./dfp-ad";

export function DfpAdWrapper(props) {
  const { networkId, AD_CONFIG, targetingFunc } = props;
  const DfpAdWrapper = createDfpAdComponent({
    defaultNetworkID: networkId,
    config: AD_CONFIG,
    targeting: targetingFunc
  });

  return <DfpAdWrapper {...props} />;
}