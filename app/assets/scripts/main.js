'use strict';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { normalize } from 'polished';

import theme from './atomic-components/theme';
import { themeVal } from './atomic-components/utils/functions';
import { collecticonsFont } from './atomic-components/collecticons';

import store from './utils/store';
import history from './utils/history';

import Home from './views/home';
import UhOh from './views/uhoh';
import Playground from './views/playground';

const CSSNormalize = createGlobalStyle` ${normalize()} `;
const CSSCollecticons = createGlobalStyle` ${collecticonsFont()} `;

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  body {
    background: #fff;
    color: ${themeVal('typography.baseFontColor')};
    font-size: ${themeVal('typography.rootFontSize')};
    line-height: ${themeVal('typography.baseLineHeight')};
    font-family: ${themeVal('typography.baseFontFamily')};
    font-weight: ${themeVal('typography.baseFontWeight')};
    font-style: ${themeVal('typography.baseFontStyle')};
    min-width: ${themeVal('layout.rowMinWidth')};
  }
`;

// Root component. Used by the router.
const Root = () => (
  <Provider store={store}>
    <Router history={history}>
      <ThemeProvider theme={theme.main}>
        <React.Fragment>
          <CSSNormalize />
          <CSSCollecticons />
          <GlobalStyle />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/playground' component={Playground} />
            <Route path='*' component={UhOh} />
          </Switch>
        </React.Fragment>
      </ThemeProvider>
    </Router>
  </Provider>
);

render(<Root store={store} />, document.querySelector('#app-container'));
