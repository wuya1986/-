import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import AliyunPush from 'react-native-aliyun-push';

import {
  ActivityIndicator,
  Image,
  Platform,
  View,
} from 'react-native';

import {
  Button,
  Container,
  Content,
  Form,
  Input,
  Item,
  Label,
  Text,
} from 'native-base';

import styles from '../styles';

import { login, sendcode } from '../actions/auth';
import CountDownButton from '../components/CountDownButton';

const drawerImage = require('../assets/logo.png');

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile_no: '',
      verify_code: '',
      error: '',
      push_device_id: '',
      push_device_type: Platform.OS,
    };
  }

  handleSendCode(shouldStartCountting) {
    this.setState({
      error: '',
    });
    shouldStartCountting(true);
    this.props.sendcode({ mobile_no: this.state.mobile_no });
  }

  handleLogin(e) {
    let error;
    if (!this.state.mobile_no) {
      error = '电话号码必須';
    } else if (!(/^1\d{10}$/).test(this.state.mobile_no)) {
      error = '电话号码格式不正确';
    } else if (!this.state.verify_code) {
      error = '验证码必填';
    }
    if (error) {
      this.setState({
        error,
      });
    } else {
      AliyunPush.getDeviceId((deviceId) => {
        this.state.push_device_id = deviceId;
        this.props.login(this.state);
      });
    }
  }

  render() {
    const { auth, auth: { loading, error } } = this.props;
    return (
      <Container style={styles.container}>
        <Content>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image square style={styles.drawerImage} source={drawerImage} />
          </View>
          <Form>
            <Item>
              <Label>电话号码</Label>
              <Input
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(text) => {
                    this.setState({
                      error: '',
                      mobile_no: text,
                    });
                }}
                value={this.state.mobile_no}
              />
            </Item>
            <Item>
              <Label>短信验证码</Label>
              <Input
                keyboardType="numeric"
                onChangeText={(text) => {
                    this.setState({
                      error: '',
                      verify_code: text,
                    });
                }}
                value={this.state.verify_code}
              />
              <CountDownButton
                timerCount={60}
                timerTitle="获取验证码"
                enable={(/^1\d{10}$/).test(this.state.mobile_no)}
                onClick={(shouldStartCountting) => {
                    this.handleSendCode(shouldStartCountting);
                }}
                timerEnd={() => {
                    this.setState({
                      state: '倒计时结束',
                    });
                }}
              />
            </Item>
          </Form>
          <Text style={{ color: '#FF0000', fontSize: 15, marginLeft: 15 }}>{error || this.state.error}</Text>
          { loading &&
            <ActivityIndicator />
          }

          <Button
            block
            style={{ margin: 15, marginTop: 50 }}
            onPress={e => this.handleLogin(e)}
            disabled={loading}
          >
            <Text>登录</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  login: info => dispatch(login(info)),
  sendcode: info => dispatch(sendcode(info)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
