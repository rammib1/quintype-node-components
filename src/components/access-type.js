import React, {Component} from 'react';
import {connect} from 'react-redux';
import {SUBSCRIPTION_PLAN_UPDATED, SUBSCRIPTION_GROUP_UPDATED} from "../store/actions";
import PropTypes from "prop-types";
import {awaitHelper} from "../utils";

class AccessTypeBase extends Component {
    constructor(props){
        super(props);
    }

    loadScript(callback) {
        const accessTypeKey = get(this.props, ['accessTypeKey']);
        if(accessTypeKey && !global.AccessType) {
            const accessTypeScript = document.createElement('script');
            accessTypeScript.setAttribute("src", `https://staging.accesstype.com/frontend/accesstype.js?key=${accessTypeKey}&env=sandbox`); //`https://accesstype.com/frontend/accesstype.js?key=${accessTypeKey}`
            accessTypeScript.setAttribute("data-accessType-script", "1");
            accessTypeScript.async = 1;
            accessTypeScript.onload = () => callback();
            document.body.appendChild(accessTypeScript);
            return true;
        }

        return false;
    }

    async setUser(emailAddress, mobileNumber) {
        const { error, data: user }  = await awaitHelper(AccessType.setUser({ 'emailAddress': emailAddress, 'mobileNumber':  mobileNumber}));
    }

    async getSubscription() {
        const { error, data: subscriptions }  = await awaitHelper(AccessType.getPaymentOptions());
    }

    async getPlans() {
        const { error, data: plans }  = await awaitHelper(AccessType.getPaymentOptions());

    }

    handleRazorPayPayment() {

    }

    hasAccess() {

    }

    render() {
        const { member, logout, children, isLoading } = this.props;
        return children({});
    }

}

AccessTypeBase.propTypes = {
    children: PropTypes.func.isRequired
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch  => ({
    subscriptionGroupLoaded: groups => dispatch({type: SUBSCRIPTION_GROUP_UPDATED}, groups),
    subscriptionPlansLoaded: plans => dispatch({type: SUBSCRIPTION_PLAN_UPDATED, plans})
});

export const AccessType = connect(mapStateToProps, mapDispatchToProps)(AccessTypeBase);
