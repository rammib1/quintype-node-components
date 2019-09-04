
    import React from "react";

    import ReactDOM from "react-dom";

    window.Components = {};


    import Wrapper from '../node_modules/better-docs/lib/wrapper.js';

    window.React = React;

    window.ReactDOM = ReactDOM;

    window.Wrapper = Wrapper;

  import ClientSideOnlyBase from '../src/components/client-side-only.js';
Components.ClientSideOnlyBase = ClientSideOnlyBase;

import WithHostUrlBase from '../src/components/with-host-url.js';
Components.WithHostUrlBase = WithHostUrlBase;