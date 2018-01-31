import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import AliyunPush from 'react-native-aliyun-push';

import {
  ActivityIndicator,
  Platform,
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

import { login } from '../actions/auth';

import styles from '../styles';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
      push_device_id: '',
      push_device_type: Platform.OS,
    };
  }

  handleForgotPassword(e) {
    const params = this.state;
    this.props.passwordScreen(params);
  }

  handleLogin(e) {
    let error;
    if (!this.state.username) {
      error = '用户名必須';
    } else if (!this.state.password) {
      error = '密码必須';
      /* } else if (!(/^1\d{10}$/).test(this.state.username)) {
       *   error = '用户名格式应为电话号码格式';*/
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
          <Form>
            <Item>
              <Label>用户名</Label>
              <Input
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(text) => {
                    this.setState({
                      error: '',
                      username: text,
                    });
                }}
                value={this.state.username}
              />
            </Item>
            <Item>
              <Label>密码</Label>
              <Input
                secureTextEntry
                onChangeText={(text) => {
                    this.setState({
                      error: '',
                      password: text,
                    });
                }}
                value={this.state.password}
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
          <Button transparent info style={{ marginTop: 10, marginLeft: 5 }} onPress={e => this.handleForgotPassword(e)}><Text>找回密码</Text></Button>
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
  passwordScreen: params =>
    dispatch(NavigationActions.navigate({ routeName: 'Password', params })),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
