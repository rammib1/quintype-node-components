import React, {Component} from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';
import {PAYMENT_OPTIONS_UPDATED, SUBSCRIPTION_GROUP_UPDATED} from "../store/actions";
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
        if(!this.props.accessTypeHost) {
            console.warn(`Host missing`);
            return false;
        }
        const accessTypeKey = get(this.props, ['accessTypeKey']);
        if(accessTypeKey && !global.AccessType && global.document) {
            const accessTypeScript = document.createElement('script');
            accessTypeScript.setAttribute("src", this.props.accessTypeHost); //`https://accesstype.com/frontend/accesstype.js?key=${accessTypeKey}`
            accessTypeScript.setAttribute("data-accessType-script", "1");
            accessTypeScript.async = 1;
            accessTypeScript.onload = () => callback();
            document.body.appendChild(accessTypeScript);
            return true;
        }
        global.AccessType && callback();
        return true;
    }

    async setUser(emailAddress, mobileNumber) {
        const { error, data: user }  = await awaitHelper(global.AccessType.setUser({ 'emailAddress': emailAddress, 'mobileNumber':  mobileNumber}));
        if(error) {
            console.warn(`User context setting failed --> `, error);
            return false
        }
        return true;
    }

    async hasAccess() {
      const storyId = get(this.props, ['story', 'id'], '');
      const { error, data: hasAccess }  = await awaitHelper(global.AccessType.hasAccess(storyId));
      if(error) {
        console.warn(`Access check failed --> `, error);
        return false;
      }
      return hasAccess;
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

    async getPaymentOptions() {
        const { error, data: paymentOptions }  = await awaitHelper(global.AccessType.getPaymentOptions());
        if(error) {
            return {
                error: 'payment options fetch failed'
            };
        }
        this.props.paymentOptionsLoaded(paymentOptions);
        return paymentOptions;
    }

    async runSequentialCalls() {
        const user = await this.setUser(this.props.email, this.props.phone);
        if(user) {
            this.getSubscription();
            this.getPaymentOptions();
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


    initRazorPayPayment(subscriptionId) {
        if(!subscriptionId){
            console.warn('Razor pay needs subscription id');
            return false;
        }
        const {subscriptions, paymentOptions} = this.props;
        const {id, title, description, 'price_cents': priceCents, 'price_currency': priceCurrency, 'duration_length': durationLength, 'duration_unit': durationUnit } = subscriptions.find(sub => sub.id = subscriptionId);
        const paymentObject = {
            type: 'standard',
            plan: {id, title, description, price_cents: priceCents, price_currency: priceCurrency, duration_length: durationLength, duration_unit: durationUnit},
            payment: {payment_type: 'razorpay', amount_cents: priceCents, amount_currency: priceCurrency},
        };
        paymentOptions.razorpay.proceed(paymentObject);
    }


    async checkAccess(assetId) {
        if(!assetId){
            console.warn('AssetId is required');
            return false;
        }
        const accessObject = {
            id: assetId,
            type: 'story',
            attributes: {}
        };
        const meteringParam = this.props.disableMetering === true ? `?disable-meter=true` : '';
        const { error, data: access }  = await awaitHelper((await global.fetch(`/api/access/v1/stories/${assetId}/amp-access${meteringParam}`)).json());
        if(error){
            return error;
        }
        return access;
    }

    render() {
        const {children} = this.props;
        return children({
            initAccessType: () => this.initAccessType(),
            initRazorPayPayment: initRazorPayPayment => this.initRazorPayPayment(initRazorPayPayment),
            checkAccess: assetId => this.checkAccess(assetId)
        });
    }

}

AccessTypeBase.propTypes = {
    children: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.number
};

const mapStateToProps = state => ({
    subscriptions : state.subscriptions || null,
    paymentOptions: state.paymentOptions || null
});


const mapDispatchToProps = dispatch  => ({
    subscriptionGroupLoaded: subscriptions => dispatch({type: SUBSCRIPTION_GROUP_UPDATED, subscriptions}),
    paymentOptionsLoaded: paymentOptions => dispatch({type: PAYMENT_OPTIONS_UPDATED, paymentOptions})
});

export const AccessType = connect(mapStateToProps, mapDispatchToProps)(AccessTypeBase);
