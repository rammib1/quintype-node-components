import React from "react";
import PropTypes from "prop-types";
import { createDfpAdComponent } from "./dfp-ad";

export function DfpAdWrapper(props) {
  const DfpAd = createDfpAdComponent(props);

  return <DfpAd {...props} />;
}