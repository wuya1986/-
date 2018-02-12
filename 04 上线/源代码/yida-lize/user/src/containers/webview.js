import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  BackHandler,
  Platform,
  StyleSheet,
  WebView
} from 'react-native';
import {
  Button,
  Icon,
  View,
} from 'native-base';
import MapLinking from 'react-native-map-linking';
import AppLink from 'react-native-app-link';
import UserAgentIOS from "rn-ios-user-agent";

import constants from '../constants/';

import styles from '../styles';

/**
   一个共通的webview浏览器，跟web保持沟通，能支持导航等功能
 */
class WebViewScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: navigation.state.params.title,
  });

  constructor(props) {
    super(props);
    this.state = {
      canBack: false
    };
    this.handleBack = this.handleBack.bind(this);
  }

  componentDidMount () {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.handleBack)
    }
  }

  componentWillUnmount () {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBack)
    }
  }

  handleBack() {
    if (this.state.canBack) {
      this.webview.goBack();
      return true;
    }
  }

  onNavigationStateChange(e) {
    this.setState({
      canBack: e.canGoBack
    })
  }

  sendMessage(data) {
    this.webview.postMessage(data);
  }
  handleMessage(e) {
    const data = JSON.parse(e.nativeEvent.data);
    if (data.key === 'geolocation') { // 导航: {key: 'geolocation', value: [112, 30]}
      MapLinking.navigate({lat: data.value[0], lng: data.value[1], title: '目的地'});
    } else if (data.key === 'app') { // 打开app: {key: 'app', value: {url, appName, appStoreId, playStoreId}}
      AppLink.maybeOpenURL(data.value.url, data.value);
    } else if (data.key === 'wxunify') { // 支付下单: {key: 'wxunify', value: {}}
      // TODO
    }
  }

  render() {
    const { auth, auth: { user }, navigation } = this.props;
    const  uri  = `${constants.APPLICATIONS_URL}${navigation.state.params.uri}?token=${user.token}`;
    console.log(uri);
    const userAgent = 'user-webview';
    if (Platform.OS === 'ios') {
      if (userAgent) {
        UserAgentIOS.set(userAgent);
      } else {
        UserAgentIOS.unset();
      }
    }
    return (
      <WebView
        ref={webview => this.webview = webview}
        onMessage={ (e) => this.handleMessage(e) }
        source={{uri}}
        onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
        style={styles.container}
        userAgent={userAgent}
        startInLoadingState={true}>
      </WebView>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(WebViewScreen);
