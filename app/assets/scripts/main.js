'use strict';
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import theme from './atomic-components/theme';

import store from './utils/store';
import history from './utils/history';

import GlobalStyles from './global-styles';

import Home from './views/home';
import UhOh from './views/uhoh';
import Playground from './views/playground';

// Root component. Used by the router.
const Root = () => (
  <Provider store={store}>
    <Router history={history}>
      <ThemeProvider theme={theme.main}>
        <React.Fragment>
          <GlobalStyles />
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
