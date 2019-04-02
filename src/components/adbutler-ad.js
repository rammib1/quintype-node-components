import React, { Component } from "react";
import { awaitHelper } from "../utils";
import { connect } from "react-redux";
import get from "lodash/get";
import { ZONES_BEING_LOADED, ZONES_LOADED, UPDATE_ZONES } from "../store/actions";

const zoneTypes = {
  "banner_zone": "banner",
  "text_zone": "text",
  "email_zone": "email",
  "vast_zone": "vast-zone"
}

function getZone(zonesList, name = '') {
  return zonesList.filter(zone => zone.name === name)[0];
}

class AdbutlerAdBase extends Component {
  constructor(props) {
    super(props);
    this.zoneTag = '';
  }

  componentDidMount() {
    if (!this.props.isLoading) {
      this.props.updateLoadingStatus(ZONES_BEING_LOADED);
      !this.props.zonesList.length && this.getZones();
      this.getZoneTag();
    }
  }

  async getZones() {
    const networkId = get(this.props, ["networkId"], "");
    const getZoneApi = `/adbutler/zones`;
    const { data: { data: zonesList }, error } = await awaitHelper(await global.fetch(getZoneApi).json());
    this.props.updateZones(zonesList);
    this.props.updateLoadingStatus(ZONES_LOADED);
  }

  async getZoneTag() {
    const {zonesList, adtype = "", networkId = ""} = this.props;
    // Hardcoding adtype to "Default Zone" now for testing purpose
    const { id: zoneId, object: zoneType } = getZone(zonesList, "Default Zone");
    const zoneTypeStr = zoneTypes[zoneType];
    const zoneTagApi = `/adbutler/${zoneTypeStr}/${zoneId}`;
    const { data: { data: { "iframe_no_js": zoneTag } }, error }  = await awaitHelper(await global.fetch(zoneTagApi).json());
    this.zoneTag = zoneTag;
  }

  render() {
    return <div dangerouslySetInnerHTML={{__html: this.zoneTag}}></div>;
  }
}



const mapStateToProps = state => ({
    zonesList: state.adbutlerZones,
    isLoading: state.zonesLoading
});

const mapDispatchToProps = dispatch => ({
   updateZones(zonesList) {
     return dispatch({
      type: UPDATE_ZONES,
      update: zonesList
    });
   },
  updateLoadingStatus(type) {
    return dispatch({
      type
    })
  }
});

export const AdbutlerAd = connect(mapStateToProps, mapDispatchToProps)(AdbutlerAdBase);