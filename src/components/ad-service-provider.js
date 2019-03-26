import React from "react";
import PropTypes from "prop-types";
import { DfpAdWrapper } from "./dfp-ad-wrapper";

export function AdServiceProvider(props) {
  const { adService = "", defaultNetworkID = "" } = props;

  if(!defaultNetworkID) {
    return null;
  }

  switch(adService) {
    case "dfp":
      return <DfpAdWrapper {...props} />;
    default:
      return <DfpAdWrapper {...props} />;
  };
}

AdServiceProvider.propTypes = {
  adService: PropTypes.string,
  defaultNetworkID: PropTypes.string
};