import React, { Component } from 'react';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import { Root } from 'native-base';
import SplashScreen from 'react-native-splash-screen';

import thunk from 'redux-thunk';
import api from './middleware/api';

import AppWithNavigationState from './containers/AppNavigator';
import reducer from './reducers';

const middleware = [thunk, api];
const store = createStore(reducer, applyMiddleware(...middleware));

export default class example extends Component {
  render() {
    return (
      <Provider store={store}>
        <Root>
          <AppWithNavigationState />
        </Root>
      </Provider>
    );
  }
  componentDidMount() {
    SplashScreen.hide();
  }
}
