import React from 'react';
import { YellowBox, AppRegistry, View, AsyncStorage } from 'react-native';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'Class RCTCxxModule']);

import App from './App';

AppRegistry.registerComponent('bridge', () => App);
