// This is a refactor of the existing access type implementation.
import PropTypes from "prop-types";
import { batch, useDispatch } from "react-redux";
import { awaitHelper } from "../utils";
import {
  accessIsLoading,
  accessUpdated,
  assetPlanLoaded,
  campaignSubscriptionGroupLoaded,
  getAssetPlans,
  getCampaignSubscription,
  getPaymentOptions,
  getSubscription,
  getSubscriptionForUser,
  initPaypalPayment,
  initRazorPayPayment,
  initStripePayment,
  loadAccessTypeScript,
  meterUpdated,
  paymentOptionsLoaded,
  pingBackMeteredStory,
  setUser,
  subscriptionGroupLoaded,
  validateCoupon,
} from "./accesstype-utils";

export const AccessTypeV2 = ({
  children,
  email,
  phone,
  enableAccesstype,
  accessTypeKey,
  accessTypeBkIntegrationId,
  isStaging,
  disableMetering,
}) => {
  const dispatch = useDispatch();
  // using useSelector three times since it might force re render when we update state if we destructure from the state
  //   const subscriptions = useSelector(
  //     (state) => get(state, ["subscriptions"], null),
  //     shallowEqual
  //   );
  //   const paymentOptions = useSelector(
  //     (state) => get(state, ["paymentOptions"], null),
  //     shallowEqual
  //   );
  //   const assetPlans = useSelector(
  //     (state) => get(state, ["assetPlans"], null),
  //     shallowEqual
  //   );

  const initAccessType = async () => {
    try {
      return loadAccessTypeScript({
        enableAccesstype,
        accessTypeKey,
        isStaging,
      });
    } catch (e) {
      console.warn(`AT failed to load`, e);
    }
  };

  const checkAccess = async (assetId) => {
    if (!assetId) {
      console.warn("AssetId is required");
      return false;
    }

    dispatch(accessIsLoading(true));

    const asset = { id: assetId, type: "story" };
    const { error, data: accessData } = await awaitHelper(
      global.AccessType.isAssetAccessible(asset, disableMetering)
    );

    const accessById = { [assetId]: accessData };

    dispatch(accessIsLoading(false));

    const { granted, grantReason, data = {} } = accessData;
    if (!disableMetering && granted && grantReason === "METERING") {
      pingBackMeteredStory(asset, accessData);
      dispatch(meterUpdated(data.numberRemaining || -1));
    }

    if (error) {
      return error;
    }
    return accessById;
  };

  const initSubscriptionDetails = async () => {
    let jwtResponse = await fetch(
      `/api/v1/access-token/integrations/${accessTypeBkIntegrationId}`
    );
    const { error } = await awaitHelper(
      setUser(
        email,
        phone,
        jwtResponse.headers.get("x-integration-token"),
        !!jwtResponse.headers.get("x-integration-token")
      )
    );
    if (!error) {
      try {
        Promise.all([
          getSubscription({ accessTypeKey, isStaging }),
          getPaymentOptions(),
          getAssetPlans(),
          getCampaignSubscription(),
        ]).then(
          ([
            subscriptionGroups,
            paymentOptions,
            assetPlans,
            campaignSubscriptionGroups,
          ]) => {
            batch(() => {
              dispatch(subscriptionGroupLoaded(subscriptionGroups));
              dispatch(paymentOptionsLoaded(paymentOptions));
              dispatch(assetPlanLoaded(assetPlans));
              dispatch(
                campaignSubscriptionGroupLoaded(campaignSubscriptionGroups)
              );
            });
          }
        );
      } catch (e) {
        console.log(`Subscription / payments failed`, e);
      }
    }
  };

  return children({
    initAccessType,
    initSubscriptionDetails,
    initRazorPayPayment,
    initStripePayment,
    initPaypalPayment,
    checkAccess,
    getSubscriptionForUser,
    accessUpdated,
    accessIsLoading,
    getAssetPlans,
    validateCoupon,
  });
};

AccessTypeV2.propTypes = {
  children: PropTypes.func.isRequired,
  email: PropTypes.string,
  phone: PropTypes.number,
  isStaging: PropTypes.bool,
  enableAccesstype: PropTypes.bool.isRequired,
  accessTypeKey: PropTypes.string.isRequired,
  accessTypeBkIntegrationId: PropTypes.string.isRequired,
};
