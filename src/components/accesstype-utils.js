import get from "lodash/get";
import {
  ACCESS_BEING_LOADED,
  ACCESS_UPDATED,
  ASSET_PLANS,
  CAMPAIGN_SUBSCRIPTION_GROUP_UPDATED,
  METER_UPDATED,
  PAYMENT_OPTIONS_UPDATED,
  SUBSCRIPTION_GROUP_UPDATED,
} from "../store/actions";
import { awaitHelper } from "../utils";

const prod_Host = "https://www.accesstype.com";
const staging_Host = "https://staging.accesstype.com";

export const loadAccessTypeScript = async ({
  enableAccesstype,
  accessTypeKey,
  isStaging,
}) => {
  if (!enableAccesstype) {
    return false;
  }

  const HOST = isStaging ? staging_Host : prod_Host;
  const environment = isStaging ? "&env=sandbox" : "";
  const accessTypeHost = `${HOST}/frontend/v2/accesstype.js?key=${accessTypeKey}${environment}`;
  const isATScriptAlreadyPresent = document.querySelector(
    `script[src="${accessTypeHost}"]`
  );
  if (
    accessTypeKey &&
    !isATScriptAlreadyPresent &&
    !global.AccessType &&
    global.document
  ) {
    const accessTypeScript = document.createElement("script");
    accessTypeScript.setAttribute("src", accessTypeHost);
    accessTypeScript.setAttribute("id", "AccessTypeScript");
    accessTypeScript.setAttribute("data-accessType-script", "1");
    accessTypeScript.async = 1;
    document.body.appendChild(accessTypeScript);
    return Promise((resolve, reject) => {
      accessTypeScript.onload = resolve();
      accessTypeScript.onerror = reject();
    });
  }
  if (global.AccessType) return true;
};

export const setUser = async (
  emailAddress,
  mobileNumber,
  accesstypeJwt,
  isLoggedIn = true
) => {
  if (!global.AccessType) {
    return null;
  }
  const userObj = isLoggedIn
    ? {
        emailAddress,
        mobileNumber,
        accesstypeJwt,
      }
    : { isLoggedIn: false };
  const { error, data: user } = await awaitHelper(
    global.AccessType.setUser(userObj)
  );
  if (error) {
    console.warn(`User context setting failed --> `, error);
    return error;
  }
  return user;
};

export const validateCoupon = async (subscriptionPlanId, couponCode) => {
  if (!global.AccessType) {
    return {};
  }
  const { error, data } = await awaitHelper(
    global.AccessType.validateCoupon({
      subscriptionPlanId,
      couponCode,
    })
  );
  if (error) {
    console.warn(`Error --> `, error);
    return error;
  }
  return data;
};

export const getSubscription = async ({ accessTypeKey, isStaging }) => {
  const HOST = isStaging ? staging_Host : prod_Host;

  // TODO: use AccesstypeJS method insead of direct api call
  const accessTypeHost = `${HOST}/api/v1/subscription_groups.json?key=${accessTypeKey}`;

  const { error, data: subscriptions } = await awaitHelper(
    (await global.fetch(accessTypeHost)).json()
  );
  if (error) {
    return {
      error: "subscriptions fetch failed",
    };
  }
  return subscriptions["subscription_groups"] || [];
};

export const getPaymentOptions = async () => {
  if (!global.AccessType) {
    return [];
  }
  const { error, data: paymentOptions } = await awaitHelper(
    global.AccessType.getPaymentOptions()
  );
  if (error) {
    return {
      error: "payment options fetch failed",
    };
  }
  return paymentOptions;
};

export const getAssetPlans = async (storyId = "") => {
  if (!global.AccessType) {
    return [];
  }
  const { error, data: assetPlans = {} } = await awaitHelper(
    global.AccessType.getAssetPlans({ id: storyId, type: "story" })
  );
  if (error) {
    return {
      error: "asset plan fetch failed",
    };
  }

  return assetPlans;
};

export const getCampaignSubscription = async ({
  isAccessTypeCampaignEnabled = false,
  accessTypeKey,
  isStaging,
}) => {
  if (isAccessTypeCampaignEnabled) {
    const HOST = isStaging ? staging_Host : prod_Host;

    const accessTypeHost = `${HOST}/api/v1/campaigns.json?key=${accessTypeKey}`;

    const { error, data: campaignSubscriptions } = await awaitHelper(
      (await global.fetch(accessTypeHost)).json()
    );

    if (error) {
      return {
        error: "subscriptions fetch failed",
      };
    }
    return campaignSubscriptions["subscription_groups"] || [];
  }
  return [];
};

export const getSubscriptionForUser = async () => {
  if (!global.AccessType) {
    return {};
  }

  const { error, data: subscriptions = [] } = await awaitHelper(
    global.AccessType.getSubscriptions()
  );
  if (error) {
    return error;
  }
  return subscriptions;
};

export function makePaymentObject({
  selectedPlan = {},
  couponCode = "",
  recipientSubscriber = {},
  planType = "",
  storyId = "",
  storyHeadline = "",
  storySlug = "",
  paymentType = "",
  successUrl = "",
  returnUrl = "",
  cancelUrl = "",
}) {
  const {
    id,
    title,
    description,
    price_cents: price_cents,
    price_currency: price_currency,
    duration_length: duration_length,
    duration_unit: duration_unit,
  } = selectedPlan;
  const paymentObject = {
    type: planType,
    plan: {
      id,
      title,
      description,
      price_cents: price_cents,
      price_currency: price_currency,
      duration_length: duration_length,
      duration_unit: duration_unit,
    },
    coupon_code: couponCode,
    payment: {
      payment_type: paymentType,
      amount_cents: price_cents,
      amount_currency: price_currency,
    },
    assets: [
      {
        id: storyId,
        title: storyHeadline,
        slug: storySlug,
      },
    ],
    recipient_subscriber: recipientSubscriber, //for gift subscription
  };
  if ((successUrl || returnUrl) && cancelUrl) {
    paymentObject.options = {};

    paymentObject.options.urls = {
      cancel_url: cancelUrl,
    };

    if (returnUrl) {
      paymentObject.options.urls["return_url"] = returnUrl;
    } else {
      paymentObject.options.urls["success_url"] = successUrl;
    }
  }
  return paymentObject;
}

export function makePlanObject(
  selectedPlanObj = {},
  planType = "",
  storyId = "",
  storyHeadline = "",
  storySlug = ""
) {
  return selectedPlanObj.argType && selectedPlanObj.argType === "options"
    ? {
        selectedPlan: selectedPlanObj.selectedPlan,
        planType: selectedPlanObj.planType,
        storyId: selectedPlanObj.storyId,
        storyHeadline: selectedPlanObj.storyHeadline,
        storySlug: selectedPlanObj.storySlug,
        couponCode: selectedPlanObj.couponCode,
        recipientSubscriber: selectedPlanObj.recipientSubscriber,
      }
    : {
        selectedPlan: selectedPlanObj,
        planType,
        storyId,
        storyHeadline,
        storySlug,
      };
}
//TODO -> need to write test cases to cover all scenarios , selectedPlan, planType , coupon, urls, story details etc.
export const initRazorPayPayment = (
  selectedPlanObj = {},
  planType = "",
  storyId = "",
  storyHeadline = "",
  storySlug = ""
) => {
  if (!selectedPlanObj) {
    console.warn("Razor pay needs a plan");
    return false;
  }

  const planObject = makePlanObject(
    selectedPlanObj,
    planType,
    storyId,
    storyHeadline,
    storySlug
  ); //we are doing this to sake of backward compatibility and will be refactored later.
  const { paymentOptions } = this.props;
  planObject["paymentType"] = get(planObject.selectedPlan, ["recurring"])
    ? "razorpay_recurring"
    : "razorpay";
  const paymentObject = this.makePaymentObject(planObject);
  return paymentOptions.razorpay.proceed(paymentObject);
};

//TODO -> need to write test cases to cover all scenarios , selectedPlan, planType , coupon, urls, story details etc.
export const initStripePayment = (options = {}) => {
  if (!options.selectedPlan) {
    console.warn("Stripe pay needs a plan");
    return false;
  }

  const { paymentOptions } = this.props;
  const paymentType = get(options.selectedPlan, ["recurring"])
    ? "stripe_recurring"
    : "stripe";
  const paymentObject = this.makePaymentObject({ paymentType, ...options });
  return paymentOptions.stripe
    ? paymentOptions.stripe.proceed(paymentObject)
    : Promise.reject({ message: "Payment option is loading..." });
};

//TODO -> need to write test cases to cover all scenarios , selectedPlan, planType , coupon, urls, story details etc.
export const initPaypalPayment = (options = {}) => {
  if (!options.selectedPlan) {
    console.warn("Paypal pay needs a plan");
    return false;
  }

  const { paymentOptions } = this.props;
  const paymentType = get(options.selectedPlan, ["recurring"])
    ? "paypal_recurring"
    : "paypal";
  const paymentObject = this.makePaymentObject({ paymentType, ...options });
  return paymentOptions.paypal
    ? paymentOptions.paypal
        .proceed(paymentObject)
        .then((response) => response.proceed(paymentObject))
    : Promise.reject({ message: "Payment option is loading..." });
};

export const pingBackMeteredStory = async (asset, accessData) => {
  const stringData = JSON.stringify(accessData);

  if (global.navigator && global.navigator.sendBeacon) {
    global.navigator.sendBeacon(
      `/api/access/v1/stories/${asset.id}/pingback`,
      stringData
    );
    return true;
  }

  const { data, error } = await awaitHelper(
    global.AccessType.pingbackAssetAccess(asset, accessData)
  );
  return true;
};

// action creators

export const accessIsLoading = (isLoading) => ({
  type: ACCESS_BEING_LOADED,
  loading: isLoading,
});

export const accessUpdated = (access) => ({ type: ACCESS_UPDATED, access });

export const subscriptionGroupLoaded = (subscriptions) => ({
  type: SUBSCRIPTION_GROUP_UPDATED,
  subscriptions,
});

export const paymentOptionsLoaded = (paymentOptions) => ({
  type: PAYMENT_OPTIONS_UPDATED,
  paymentOptions,
});

export const meterUpdated = (meterCount) => ({
  type: METER_UPDATED,
  meterCount,
});

export const assetPlanLoaded = (assetPlans) => ({
  type: ASSET_PLANS,
  assetPlans,
});

export const campaignSubscriptionGroupLoaded = (campaignSubscriptions) => ({
  type: CAMPAIGN_SUBSCRIPTION_GROUP_UPDATED,
  campaignSubscriptions,
});
