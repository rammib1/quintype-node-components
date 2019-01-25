import {
  BREAKING_NEWS_UPDATED,
  CLIENT_SIDE_RENDERED,
  PAGE_LOADING,
  NAVIGATE_TO_PAGE,
  PAGE_FINISHED_LOADING,
  HAMBURGER_CLICKED,
  HAMBURGER_CLOSED,
  MEMBER_UPDATED,
  MEMBER_BEING_LOADED,
  SUBSCRIPTION_GROUP_UPDATED,
  PAYMENT_OPTIONS_UPDATED
} from './actions';

function setToTrueOnEvent() {
  const events = Array.from(arguments);
  return function(state = false, action) {
    return state || events.includes(action.type);
  }
}

function breakingNewsReducer(state = [], action) {
  switch (action.type) {
    case BREAKING_NEWS_UPDATED: return action.stories;
    default: return state;
  }
}

const breakingNewsLoadedReducer = setToTrueOnEvent(BREAKING_NEWS_UPDATED);
const clientSideRenderedReducer = setToTrueOnEvent(CLIENT_SIDE_RENDERED);

function pageLoadingReducer(state = false, action) {
  switch (action.type) {
    case PAGE_LOADING: return true;
    case NAVIGATE_TO_PAGE: return false;
    case PAGE_FINISHED_LOADING: return false;
    default: return state;
  }
}

function hamburgerOpenedReducer(state = false, action) {
  switch(action.type) {
    case HAMBURGER_CLICKED: return true;
    case HAMBURGER_CLOSED: return false;
    case NAVIGATE_TO_PAGE: return false;
    default: return state;
  }
}

function memberReducer(state = null, action) {
  switch(action.type) {
    case MEMBER_UPDATED: return action.member;
    default: return state;
  }
}

function memberLoadingReducer(state = true, action) {
  switch (action.type) {
    case MEMBER_BEING_LOADED: return true;
    case MEMBER_UPDATED: return false;
    default: return state;
  }
}

function subscriptionReducer(state = [], action) {
  switch(action.type) {
    case SUBSCRIPTION_GROUP_UPDATED: return action.subscriptions;
    default: return state;
  }
}

function paymentOptionsReducer(state = {}, action) {
  switch (action.type) {
    case PAYMENT_OPTIONS_UPDATED: return action.paymentOptions;
    default: return state;
  }
}


export const ComponentReducers = {
  breakingNews: breakingNewsReducer,
  breakingNewsLoaded: breakingNewsLoadedReducer,
  clientSideRendered: clientSideRenderedReducer,
  pageLoading: pageLoadingReducer,
  hamburgerOpened: hamburgerOpenedReducer,
  member: memberReducer,
  memberLoading: memberLoadingReducer,
  subscriptions: subscriptionReducer,
  paymentOptions: paymentOptionsReducer
};
