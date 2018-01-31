import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Platform,
  BackHandler,
  WebView
} from 'react-native';

import UserAgentIOS from "rn-ios-user-agent";

import styles from '../styles';

/**
   一个共通的webview浏览器，跟web保持沟通，能支持导航等功能
 */
class WebViewScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: navigation.state.params.title ? navigation.state.params.title : '',
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

  render() {
    const { auth, auth: { staff } } = this.props;
    const  uri  = `${this.props.navigation.state.params.uri}?token=${staff.token}`;
    const userAgent = 'staff-webview';
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
