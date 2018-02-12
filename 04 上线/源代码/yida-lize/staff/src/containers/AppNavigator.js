import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  AppState,
  AsyncStorage,
  BackHandler,
  Platform,
} from 'react-native';
import {
  NavigationActions,
  StackNavigator,
  TabBarBottom,
  TabNavigator,
  addNavigationHelpers,
} from 'react-navigation';

import {
  View,
  Button,
  Icon,
  Text,
} from 'native-base';
import Barcode from 'react-native-smart-barcode';

import IconBadge from 'react-native-icon-badge';
import Config from 'react-native-config';

import { tokenLogin, initialStaff } from '../actions/auth';

import ApplicationScreen from './tabs/application';
import MineScreen from './tabs/mine';

import LoginScreen from './login';
import PasswordScreen from './password';
import WebViewScreen from './webview';
import ScanScreen from './scan';
import StaffProfileScreen from './staff_profile';

const MainScreenNavigator = TabNavigator({
  Application: {
    screen: ApplicationScreen,
    navigationOptions: ({ navigation }) => ({
      title: Config.app_name,
      tabBarLabel: '服务',
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon
          name="apps"
          active
          style={{ color: tintColor }}
        />
      ),
      headerRight: (
        <View>
          <Button
            transparent
            onPress={() => navigation.navigate('Scan')}
          >
            <Icon
              name="barcode"
            />
          </Button>
        </View>
      ),
    }),
  },
  Mine: {
    screen: MineScreen,
    navigationOptions: ({ navigation }) => ({
      title: Config.app_name,
      tabBarLabel: '我的',
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon
          active
          name="person"
          style={{ color: tintColor }}
        />
      ),
    }),
  },
}, {
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: '#3498db',
    inactiveTintColor: '#999999',
    labelStyle: {
      fontSize: 12,
    },
    showIcon: true,
    tabStyle: {
      padding: 0,
    },
  },
});

export const AppNavigator = StackNavigator({
  Main: {
    screen: MainScreenNavigator,
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      title: '登录',
      headerLeft: null,
      gesturesEnabled: false,
    },
  },
  Password: {
    screen: PasswordScreen,
    navigationOptions: {
      title: '忘记密码',
    },
  },
  Scan: {
    screen: ScanScreen,
    navigationOptions: {
      title: '扫码',
    },
  },
  WebView: {
    screen: WebViewScreen,
  },
  StaffProfile: {
    screen: StaffProfileScreen,
    navigationOptions: {
      title: '个人信息',
    },
  },
});

class AppWithNavigationState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState
    };
  }
  componentWillMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', () => {
        if (this.props.nav.routes.length == 1 || this.checkIsLoginScreen()) {
          return false;
        }
        this.props.dispatch(NavigationActions.back());
        return true;
      });
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', () => {});
    }
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    this.doTokenLogin();
  }

  doTokenLogin() {
    // 每次打开页面时，做tokenLogin
    const { loginScreen, tokenLogin, initialStaff } = this.props;
    // load auth
    AsyncStorage.getItem('staff').then((data) => {
      if (data) {
        const staff = JSON.parse(data);
        initialStaff(staff);
        const { token } = staff;
        tokenLogin({
          token,
        });
      } else if (!this.checkIsLoginScreen()) {
        loginScreen();
      }
    });
  }

  checkIsLoginScreen() {
    return this.props.nav.routes[this.props.nav.routes.length - 1].routeName === 'Login';
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/active|background/) && nextAppState === 'active') {
      this.doTokenLogin();
    }
    this.setState({appState: nextAppState});
  }

  render() {
    const { dispatch, nav } = this.props;
    return (
      <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
    );
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
});
const mapDispatchToProps = (dispatch, Ownprops) => ({
  dispatch,
  tokenLogin: info => dispatch(tokenLogin(info)),
  initialStaff: staff => dispatch(initialStaff(staff)),
  loginScreen: params => dispatch(NavigationActions.navigate({ routeName: 'Login', params })),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppWithNavigationState);
