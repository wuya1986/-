import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import {
  ActivityIndicator,
  Alert,
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

import { password } from '../actions/auth';
import * as ACTION from '../constants/auth';

import styles from '../styles';

class PasswordForm extends Component {
  componentDidMount() {
    const { auth } = this.props;
    // load auth
    if (auth.staff.token) {
      dispatch(NavigationActions.back());
    }
  }
  handlePassword(e) {
    if (!this.state.username) {
      this.props.auth.password_error = '用户名必須';
      /* } else if (!(/^1\d{10}$/).test(this.state.username)) {
       *   this.props.auth.password_error = '用户名格式应为电话号码格式';*/
    } else {
      this.props.password(this.state);
    }
    this.forceUpdate();
  }
  handleAlert() {
    if (this.props.auth.action == ACTION.PASSWORD_SUCCESS) {
      this.props.auth.action = '';
      Alert.alert('新密码', '新的密码已经通过短信发出，请注意查收。');
    }
  }

  render() {
    const { auth, auth: { loading, password_error, action } } = this.props;
    this.handleAlert();
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
                      username: text,
                    });
                    auth.password_error = '';
                    this.forceUpdate();
                }}
              />
            </Item>
          </Form>
          <Text>{password_error}</Text>
          { loading &&
            <ActivityIndicator />
          }
          <Button block style={{ margin: 15, marginTop: 50 }} onPress={e => this.handlePassword(e)}>
            <Text>找回密码</Text>
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
  password: info => dispatch(password(info)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PasswordForm);
