import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ActivityIndicator,
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
  Toast,
} from 'native-base';

import styles from '../styles';
import { profile, resetProfile } from '../actions/auth';

class StaffProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: '',
      error: '',
    };
  }
  handleProfile(e) {
    let error;
    if (!this.state.fullname) {
      error = '用户姓名必填';
    }
    if (error) {
      this.setState({
        error,
      });
    } else {
      this.props.profile(this.state);
    }
  }

  reset() {
    this.props.resetProfile();
  }

  render() {
    const {
      auth, auth: {
        staff, loading, error, just_requested,
      },
    } = this.props;
    if (just_requested) {
      Toast.show({
        text: '申请已经受理',
        position: 'top',
        duration: 2000,
      });
      this.reset();
    }
    return (
      <Container style={styles.container}>
        { loading &&
          <ActivityIndicator />
        }
        <Content>
          <Form>
            <Item fixedLabel>
              <Label>姓名</Label>
              <Input
                defaultValue={staff.fullname}
                onChangeText={(text) => {
                    this.setState({
                      fullname: text,
                      error: '',
                    });
                }}
              />
            </Item>
          </Form>
          <Text style={{ color: '#FF0000', fontSize: 16, marginLeft: 15 }}>{error || this.state.error}</Text>
          <Button block style={{ margin: 15, marginTop: 50 }} onPress={e => this.handleProfile(e)}>
            <Text>保存</Text>
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
  profile: info => dispatch(profile(info)),
  resetProfile: () => dispatch(resetProfile()),
});

export default connect(mapStateToProps, mapDispatchToProps)(StaffProfileForm);
