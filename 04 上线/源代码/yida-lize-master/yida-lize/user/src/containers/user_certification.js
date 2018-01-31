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
  Picker,
  Right,
  Text,
  Toast,
} from 'native-base';
import DatePicker from 'react-native-datepicker';

import styles from '../styles';
import { certification, resetCertification } from '../actions/auth';

class UserCertificationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company_name: '',
      fullname: props.auth.user.fullname,
      sex: props.auth.user.sex,
      dob: props.auth.user.dob,
      error: '',
    };
  }
  handleCertification(e) {
    let error;
    if (!this.state.company_name) {
      error = '公司全称必填';
    }
    if (error) {
      this.setState({
        error,
      });
    } else {
      this.props.certification(this.state);
    }
  }

  reset() {
    this.props.resetCertification();
  }

  render() {
    const {
      auth, auth: {
        user, loading, error, just_requested,
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
              <Label>公司全称</Label>
              <Input
                placeholder="请输入公司全名"
                onChangeText={(text) => {
                    auth.error = '';
                    this.setState({
                      company_name: text,
                      error: '',
                    });
                }}
              />
            </Item>
            <Item fixedLabel>
              <Label>姓名</Label>
              <Input
                defaultValue={this.state.fullname}
                onChangeText={(text) => {
                    this.setState({
                      fullname: text,
                      error: '',
                    });
                }}
              />
            </Item>
            <Item fixedLabel>
              <Label>性別</Label>
              <Right>
                <Picker
                  mode="dropdown"
                  style={{ width: 120 }}
                  placeholder="性别"
                  selectedValue={this.state.sex}
                  onValueChange={(value) => {
                      this.setState({
                        sex: value,
                        error: '',
                      });
                  }}
                >
                  <Item label="男" value={1} />
                  <Item label="女" value={2} />
                </Picker>
              </Right>
            </Item>
            <Item fixedLabel>
              <Label>生年月日</Label>
              <Right>
                <DatePicker
                  customStyles={{
                    dateInput: {
                      borderWidth: 0,
                    },
                  }}
                  date={this.state.dob}
                  mode="date"
                  maxDate={new Date()}
                  placeholder="生年月日"
                  format="YYYY-MM-DD"
                  confirmBtnText="设定"
                  cancelBtnText="取消"
                  onDateChange={(date) => {
                      this.setState({
                        dob: date,
                        error: '',
                      });
                  }}
                />
              </Right>
            </Item>
          </Form>
          <Text style={{ color: '#FF0000', fontSize: 16, marginLeft: 15 }}>{error || this.state.error}</Text>
          <Button block style={{ margin: 15, marginTop: 50 }} onPress={e => this.handleCertification(e)}>
            <Text>申请认证</Text>
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
  certification: info => dispatch(certification(info)),
  resetCertification: () => dispatch(resetCertification()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserCertificationForm);
