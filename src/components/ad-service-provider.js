import React from "react";
import PropTypes from "prop-types";
import { DfpAdWrapper } from "./dfp-ad-wrapper";

export function AdServiceProvider(props) {
  const { adService = '' } = props;

  switch(adService) {
    case "dfp":
      return <DfpAdWrapper {...props} />;
    default:
      return null;
  };
}

AdServiceProvider.propTypes = {
  adService: PropTypes.string
};