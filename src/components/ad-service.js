import React from "react";
import { DfpAdWrapper } from "./dfp-ad-wrapper";
import { AdbutlerAd } from "./adbutler-ad";

export function AdServices(props) {
  const { adService = '', networkId = '' } = props;

  if(!adService || !networkId) {
    return null;
  }

  switch(adService) {
    case "dfp":
      return <DfpAdWrapper {...props} />;
    case "adbutler":
      return <AdbutlerAd {...props} />;
    default:
      return null;
  };
}