import React, {Component} from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';
import {SUBSCRIPTION_PLAN_UPDATED, SUBSCRIPTION_GROUP_UPDATED} from "../store/actions";
import PropTypes from "prop-types";
import {awaitHelper} from "../utils";

class AccessTypeBase extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.initAccessType();
    }

    loadScript(callback) {
        const accessTypeKey = get(this.props, ['accessTypeKey']);
        if(accessTypeKey && !global.AccessType && global.document) {
            const accessTypeScript = document.createElement('script');
            accessTypeScript.setAttribute("src", `https://staging.accesstype.com/frontend/accesstype.js?key=${accessTypeKey}&env=sandbox`); //`https://accesstype.com/frontend/accesstype.js?key=${accessTypeKey}`
            accessTypeScript.setAttribute("data-accessType-script", "1");
            accessTypeScript.async = 1;
            accessTypeScript.onload = () => callback();
            document.body.appendChild(accessTypeScript);
            console.log(`LOADED`);
            return true;
        }
        global.AccessType && callback();
        return true;
    }

    async setUser(emailAddress, mobileNumber) {
        const { error, data: user }  = await awaitHelper(global.AccessType.setUser({ 'emailAddress': emailAddress, 'mobileNumber':  mobileNumber}));
        if(error) {
            console.warn(`User set failed`);
            return false
        }
        return true;
    }

    async getSubscription() {
        const { error, data: subscriptions }  = await awaitHelper(global.AccessType.getSubscriptionPlans());
        if(error) {
            return {
                error: 'subscriptions fetch failed'
            };
        }
        this.props.subscriptionGroupLoaded(subscriptions);
        return subscriptions;
    }

    async getPlans() {
        const { error, data: plans }  = await awaitHelper(global.AccessType.getPaymentOptions());
        if(error) {
            return {
                error: 'plans fetch failed'
            };
        }
        this.props.subscriptionPlansLoaded(plans);
        return plans;
    }

    async runSequentialCalls() {
        const user = await this.setUser(this.props.email, this.props.phone);
        if(user) {
            this.getSubscription();
            this.getPlans();
        }
    }

    initAccessType() {
        if(!this.props.email || !this.props.phone) return false;

        try {
            this.loadScript(() => this.runSequentialCalls());
            console.log(`Accesstype loaded`);
        }
        catch (e) {
            console.warn(`Accesstype load fail`, e);
        }
    }

    initRazorPayPayment() {

    }

    initMeteredStories() {

    }



    render() {
        const {children} = this.props;
        return children({initAccessType: () => this.initAccessType()});
    }

}

AccessTypeBase.propTypes = {
    children: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.number
};

const mapStateToProps = state => ({
    subscription : state.subscription || null,
    plans: state.plans || null
});


const mapDispatchToProps = dispatch  => ({
    subscriptionGroupLoaded: (groups) => dispatch({type: SUBSCRIPTION_GROUP_UPDATED, groups}),
    subscriptionPlansLoaded: (plans) => dispatch({type: SUBSCRIPTION_PLAN_UPDATED, plans})
});

export const AccessType = connect(mapStateToProps, mapDispatchToProps)(AccessTypeBase);
