'use strict';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { normalize } from 'polished';

import theme from './atomic-components/theme';

import store from './utils/store';
import history from './utils/history';

import Home from './views/home';
import UhOh from './views/uhoh';

const CSSNormalize = createGlobalStyle` ${normalize()} `;

// Root component. Used by the router.
const Root = () => (
  <Provider store={store}>
    <Router history={history}>
      <React.Fragment>
        <CSSNormalize />
        <ThemeProvider theme={theme.main}>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='*' component={UhOh} />
          </Switch>
        </ThemeProvider>
      </React.Fragment>
    </Router>
  </Provider>
);

render(<Root store={store} />, document.querySelector('#app-container'));
