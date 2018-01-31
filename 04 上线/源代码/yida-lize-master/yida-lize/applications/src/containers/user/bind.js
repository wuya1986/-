import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import {
  Button,
  ButtonArea,
  CellBody,
  CellFooter,
  CellHeader,
  CellsTitle,
  Form,
  FormCell,
  Input,
  Label,
  Page,
  Toast,
} from 'react-weui';

import { send_code, verify_code } from '../../actions/auth';

class Bind extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile_no: '',
      code: '',
    };
  }

  send_code() {
    this.props.send_code(this.state.mobile_no);
  }

  verify_code() {
    this.props.verify_code(this.state);
  }

  render() {
    const { auth: { loading, error, bind } } = this.props;
    return (
      <div>
        <Toast icon="loading" show={loading}>Loading...</Toast>
        { error ? (
          <div>{error}</div>
        ) : null
        }
        <Page>
          <CellsTitle>绑定手机号码</CellsTitle>
          <Form>
            <FormCell>
              <CellHeader>
                <Label>手机号</Label>
              </CellHeader>
              <CellBody>
                <Input
                  type="tel"
                  placeholder="11位电话号码"
                  onKeyUp={e => this.setState({
                      mobile_no: e.target.value,
                  })}
                />
              </CellBody>
            </FormCell>
            <FormCell>
              <CellHeader>
                <Label>验证码</Label>
              </CellHeader>
              <CellBody>
                <Input
                  type="number"
                  placeholder="验证码"
                  onKeyUp={e => this.setState({
                      code: e.target.value,
                  })}
                />
              </CellBody>
              <CellFooter>
                <Button
                  type="default"
                  plain
                  disabled={!(/^1\d{10}$/.test(this.state.mobile_no)) || loading}
                  onClick={e => this.send_code()}
                >
                  获取验证码
                </Button>
              </CellFooter>
            </FormCell>
          </Form>

          <ButtonArea>
            {
              bind ? (
                <Redirect to="/" />
              ) : (
                <Button
                  disabled={!(/^\d{4}$/.test(this.state.code)) || !(/^1\d{10}$/.test(this.state.mobile_no)) || loading}
                  onClick={e => this.verify_code()}
                >
                  提交
                </Button>
              )
            }
          </ButtonArea>
        </Page>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});
const mapDispatchToProps = dispatch => ({
  send_code: mobile_no => dispatch(send_code(mobile_no)),
  verify_code: info => dispatch(verify_code(info)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Bind);
