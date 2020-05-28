import React from 'react';
import { connect } from 'react-redux';

const defaultPolltypeHost = 'https://www.polltype.com';

function throttle(func, wait) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function later() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function noop() {}

  function InView(el, opts) {
    var cb = opts.onChange || noop;
    if (typeof cb !== 'function') {
      cb = noop;
    }
    var intervalDelay = opts.intervalDelay || 1000;
    var interval = null;
    var previousVisibility;
    var partialVisibility = opts.partialVisibility || false;
    var minTopValue = 0;

    function check() {
      try {
        var currentVisibility = isInView();
        if (previousVisibility !== currentVisibility) {
          previousVisibility = currentVisibility;
          cb(currentVisibility);
        }
      } catch (e) {
        if (console && console.log) {
          console.log('error in the in view check', e);
        }
      }
    }

    function startTracking() {
      check();
      interval = setInterval(check, intervalDelay);
    }

    function isInView() {
      var elRect = el.getBoundingClientRect();
      var defaultRect = {
        top: 0,
        left: 0,
        bottom: window.innerHeight || document.documentElement.clientHeight,
        right: window.innerWidth || document.documentElement.clientWidth
      };
      var viewRect = {
        top: elRect.top >= defaultRect.top,
        left: elRect.left >= defaultRect.left,
        bottom: elRect.bottom <= defaultRect.bottom,
        right: elRect.right <= defaultRect.right
      };
      var isVisible = viewRect.top && viewRect.left && viewRect.bottom && viewRect.right;

      if (partialVisibility) {
        var partialVisible = elRect.top <= defaultRect.bottom && elRect.bottom >= defaultRect.top && elRect.left <= defaultRect.right && elRect.right >= defaultRect.left;

        if (typeof partialVisibility === 'string') {
          partialVisible = viewRect[partialVisibility];
        }

        isVisible = minTopValue ? partialVisible && elRect.top <= defaultRect.bottom - minTopValue : partialVisible;
      }

      return isVisible;
    }

    startTracking();
  }

  var postMessageActionHandlers = {
    'start-view-tracking': startViewTracking,
    'set-height': setHeight,
    'qlitics-element-action': handlePolltypeEvent
  };

  function nextId() {
    var intPart = window._Pt_.idSeed++;
    var datePart = new Date().valueOf();

    return intPart + "-" + datePart;
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function detectMob() {
    return window.innerWidth <= 800;
  }

  function passDataToIframe(iframeId) {
    var iframe = document.getElementById(iframeId);
    if (!iframe) {
      return;
    }
    var message = {
      action: 'set-data',
      data: {
        isMobile: detectMob()
      }
    };
    iframe.contentWindow.postMessage(message, '*');
  }

  function handlePolltypeEvent(embedId, data) {
    if (window.PT_qlitics_event_handler) {
      var containerOpts = window._Pt_.containersInited[embedId],
        iframeId = containerOpts && containerOpts['iframeId'];

      if (iframeId) {
        window.PT_qlitics_event_handler(embedId, iframeId, data);
      }
    }
  }

  function startViewTracking(embedId) {
    var containerOpts = window._Pt_.containersInited[embedId],
      iframeId = containerOpts && containerOpts['iframeId'];
    var iframe = document.getElementById(iframeId);
    if (!iframe) {
      return;
    }

    var pageUrl = iframe.getAttribute('data-story-url') || window.location.href;
    var options = {
      onChange: function onChange(isVisible) {
        try {
          if (!isVisible) {
            return;
          }

          var message = {
            action: 'in-view',
            data: {
              'in-view': true,
              url: pageUrl
            }
          };
          iframe.contentWindow.postMessage(message, "https://polltype-web.qtstage.io");
        } catch (e) {
          if (console && console.log) {
            console.log('error in the in-view callback', e);
          }
        }
      },
      partialVisibility: true
    };

    InView(iframe, options);
  }

  function setHeight(embedId, data) {
    var iframe,
      containerOpts = window._Pt_.containersInited[embedId],
      iframeId = containerOpts && containerOpts['iframeId'];

    if (data.height > 0) {
      iframe = document.getElementById(iframeId);
      iframe.setAttribute('height', data.height + 'px');
    }

    passDataToIframe(iframeId);
  }

  function removeChildren(node) {
    if (!node) {
      return;
    }
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function initContainer(container, embedId) {
    var iframe = document.createElement('iframe');
    var iframeId = "polltype-iframe-" + nextId();

    var preview = container.getAttribute('data-polltype-preview');
    var width = container.getAttribute('data-polltype-embed-width') || '100%';
    var height = container.getAttribute('data-polltype-embed-height') || '480px';
    var storyUrl = container.getAttribute('data-story-url');
    var src = "https://polltype-web.qtstage.io" + '/poll/' + embedId + '/iframe';

    if (preview) {
      src += '/preview';
    }

    iframe.id = iframeId;
    iframe.src = src;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('width', width);
    iframe.setAttribute('height', height);
    iframe.setAttribute('scrolling', 'no');
    if (typeof storyUrl === 'string' && storyUrl.trim() !== "") {
      iframe.setAttribute('data-story-url', storyUrl.trim());
    }

    removeChildren(container);
    container.appendChild(iframe);
    container.setAttribute('data-polltype-embed-inited', true);

    window._Pt_.containersInited[embedId] = {
      'iframeId': iframeId
    };
  }

  function initAllContainers() {
    var containers = document.querySelectorAll('[data-polltype-embed-id]'),
      i = 0,
      containersLength = containers.length;

    attachPostMessageListener();

    for (i = 0; i < containersLength; i++) {
      var container = containers[i];
      var embedId = container.getAttribute('data-polltype-embed-id');
      if (window._Pt_.containersInited[embedId]) {
        continue;
      }

      try {
        initContainer(container, embedId);
      } catch (e) {
        if (console && console.log) {
          console.log('error in PT initContainer: ', e);
        }
      }
    }
  }

  function attachPostMessageListener() {
    try {
      if (window._Pt_.subscribedToPostMessage) {
        return;
      }

      window.addEventListener('message', receiveMessage, false);
      window._Pt_.subscribedToPostMessage = true;
    } catch (e) {
      if (console && console.log) {
        console.log('error in attaching postMessageListener: ', e);
      }
    }
  }

  function receiveMessage(e) {
    var origin = e.origin.replace(/^.+:\/\//, ''),
      ptHost = "https://polltype-web.qtstage.io".replace(/^.+:\/\//, '');

    if (origin !== ptHost) {
      return;
    }

    console.log('received message: ', e.origin, e.data);
    var handler = postMessageActionHandlers[e.data.action];
    if (!handler) {
      return;
    }

    try {
      handler(e.data.embedId, e.data.data);
    } catch (ex) {
      if (console && console.log) {
        console.log('error in executing postMessage handler for ' + e.data.action, ex);
      }
    }
  }

  function domReady(callback) {
    if (document.readyState === "interactive" || document.readyState === "complete") {
      callback();
      return;
    }

    document.addEventListener("DOMContentLoaded", callback);
  }

function polltypeEmbed() {
  "use strict";

  window._Pt_ = window._Pt_ || {};
  window._Pt_.idSeed = window._Pt_.idSeed || getRandomInt(1, 100);

  window._Pt_.containersInited = {};

  try {
    domReady(function() {
      try {
        initAllContainers();
      } catch (e) {
        if (console && console.log) {
          console.log('error in PT initAllContainers: ', e);
        }
      }
    });
  } catch (e) {
    if (console && console.log) {
      console.log('error in PT domReady: ', e);
    }
  }
}

class PolltypeBase extends React.Component {

  componentDidMount() {
    console.log('inside did mount')
    this.loadPolltypeJS();
  }

  loadPolltypeJS() {
    // const source = this.props.polltypeHost.replace(/^https:|^http:/i, '') + '/embed.js';
    // if (!global._polltypeAdded) {
    //   global._polltypeAdded = true;
    //   polltypeEmbed();
    //   const script = document.createElement('script');
    //   script.type = 'text/javascript';
    //   script.src = source;
    //   document.body.appendChild(script);
    // }
    polltypeEmbed(this.props.polltypeHost);
  }

  render() {
    return (
      <div id={this.props.id} data-polltype-embed-id={this.props.id} />
    );
  }
}

function mapStateToProps(state) {
  return {
    polltypeHost: state.qt.config["polltype-host"] || defaultPolltypeHost
  };
}

const Polltype = connect(mapStateToProps, {})(PolltypeBase);
export default Polltype;
