import React from 'react';
import {
  AppRegistry
} from 'react-native';
import codePush from 'react-native-code-push';
const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
};

import yidaproperty from './src/';

AppRegistry.registerComponent('yidaproperty', () => codePush(codePushOptions)(yidaproperty));
