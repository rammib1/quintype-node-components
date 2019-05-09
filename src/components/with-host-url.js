import { connect } from "react-redux";
import PropTypes from "prop-types";

function WithHostUrlBase({ children, primaryHostUrl, currentHostUrl }) {
  return children({primaryHostUrl, currentHostUrl});
}

WithHostUrlBase.propTypes = {
  children: PropTypes.func.isRequired,
  primaryHostUrl: PropTypes.string,
  currentHostUrl: PropTypes.string,
};

export const WithHostUrl = connect(mapStateToProps, mapDispatchToProps)(WithHostUrlBase);

function mapStateToProps({qt = {}}) {
  return {
    primaryHostUrl: qt.primaryHostUrl,
    currentHostUrl: qt.currentHostUrl,
  }
}

function mapDispatchToProps(dispatch) {
  return { };
}
