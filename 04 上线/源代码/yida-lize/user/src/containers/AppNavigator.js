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
import IconBadge from 'react-native-icon-badge';
import AliyunPush from 'react-native-aliyun-push';

import { tokenLogin, initialUser } from '../actions/auth';

import Svg from '../components/Svg';
import MainScreen from './tabs/main';
import ApplicationScreen from './tabs/application';
import WalletScreen from './tabs/wallet';
import MineScreen from './tabs/mine';

import LoginScreen from './login';
import UserCertificationScreen from './user_certification';
import UserTicketListScreen from './UserTicketList';
import WebViewScreen from './webview';
import ScanScreen from './scan';
import ECardPayScreen from './ecard_pay';

import Config from 'react-native-config';

const MainScreenNavigator = TabNavigator({
  Home: {
    screen: MainScreen,
    navigationOptions: ({ navigation }) => ({
      title: Config.app_name,
      tabBarLabel: '主页',
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon
          active
          name="home"
          style={{ color: tintColor }}
        />
      ),
      headerRight: (
        <View style={{flex:1,flexDirection: 'row'}}>
          <Button
            transparent
            style={{marginRight: 12}}
            onPress={() => navigation.navigate('ECardPass')}
          >
            <Svg icon="entrance_QRCode" size="18" color="#000000" />
          </Button>
          <Button
            transparent
            style={{marginRight: 12}}
            onPress={() => navigation.navigate('ECardPay')}
          >
            <Svg icon="convenient_store" size="18" color="#000000" />
          </Button>
          <Button
            transparent
            style={{marginRight: 12}}
            onPress={() => navigation.navigate('Scan')}
          >
            <Svg icon="scanning_QRCode" size="18" color="#000000" />
          </Button>
        </View>
      ),
    }),
  },
  Application: {
    screen: ApplicationScreen,
    navigationOptions: ({ navigation }) => ({
      title: Config.app_name,
      tabBarLabel: '应用',
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon
          active
          name="apps"
          style={{ color: tintColor }}
        />
      ),
    }),
  },
  Wallet: {
    screen: WalletScreen,
    navigationOptions: ({ navigation }) => ({
      title: Config.app_name,
      tabBarLabel: '一卡通',
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon
          active
          name="card"
          style={{ color: tintColor }}
        />
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
    activeTintColor: '#387ef5',
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
  Scan: {
    screen: ScanScreen,
    navigationOptions: {
      title: '扫码',
    },
  },
  ECardPay: {
    screen: ECardPayScreen,
    navigationOptions: {
      title: '扫码支付',
    },
  },
  ECardPass: {
    screen: ECardPayScreen,
    navigationOptions: {
      title: '通行证',
    },
  },
  UserCertification: {
    screen: UserCertificationScreen,
    navigationOptions: {
      title: '申请认证',
    },
  },
  UserTicketList: {
    screen: UserTicketListScreen,
    navigationOptions: {
      title: '我的工单',
    },
  },
  WebView: {
    screen: WebViewScreen,
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
    AliyunPush.removeListener(this.handleAliyunPushMessage);
  }

  componentDidMount() {
    AliyunPush.addListener(this.handleAliyunPushMessage);
    AppState.addEventListener('change', this._handleAppStateChange);

    this.doTokenLogin();
  }
  handleAliyunPushMessage = (e) => {
    console.log("Message Received. " + JSON.stringify(e));
    /* const extras=e.extras;
     * if (extras) {
     *   AliyunPush.setApplicationIconBadgeNumber(parseInt(extras.badge));
     * }*/
  };

  doTokenLogin() {
    // 每次打开页面时，做tokenLogin
    const { loginScreen, tokenLogin, initialUser } = this.props;
    // load auth
    AsyncStorage.getItem('user').then((data) => {
      if (data) {
        const user = JSON.parse(data);
        initialUser(user);
        const { token } = user;
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
  initialUser: user => dispatch(initialUser(user)),
  loginScreen: params => dispatch(NavigationActions.navigate({ routeName: 'Login', params })),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppWithNavigationState);
