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
  Select,
  Msg,
} from 'react-weui';

import { tokenLogin, certification, resetCertification } from '../../actions/auth';

class UserCertification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company_name: '',
      fullname: '',
      sex: '',
      dob: '',
      error: '',
    };
  }

  componentDidMount() {
    if (!this.props.auth.user || !this.props.auth.user.mobile_no) {
      const token = localStorage.getItem('g_token');
      this.props.tokenLogin({
        token,
      });
    }
  }

  handleCertification(e) {
    this.props.certification(this.state);
  }

  reset() {
    this.props.resetCertification();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { auth } = nextProps;
    if (auth && auth.user && !this.state.fullname) {
      this.setState({
        fullname: auth.user.fullname,
        sex: auth.user.sex,
        dob: auth.user.dob,
      }, function () {
        this.forceUpdate();
      });
    }
    return true;
  }

  render() {
    const {
      auth, auth: {
        user, loading, error, just_requested,
      },
    } = this.props;

    if (just_requested) {
      return (
        <Page className="msg_success" history={this.props.history}>
          <Msg
            type="success"
            title="申请已经受理"
            description="申请已经受理,稍后我们的工作人员会进行处理"
          />
        </Page>
      );
    }
    return (
      <div>
        <Toast icon="loading" show={loading}>Loading...</Toast>
        { error ? (
          <div>{error}</div>
        ) : null
        }
        <Page>
          <Form>
            <FormCell>
              <CellHeader>
                <Label>公司全称</Label>
              </CellHeader>
              <CellBody>
                <Input
                  type="default"
                  placeholder="请输入公司全名"
                  onKeyUp={(e) => {
                      this.setState({
                        company_name: e.target.value,
                        error: '',
                      });
                      auth.error = '';
                  }
                  }
                />
              </CellBody>
            </FormCell>
            <FormCell>
              <CellHeader>
                <Label>姓名</Label>
              </CellHeader>
              <CellBody>
                <Input
                  type="default"
                  value={this.state.fullname}
                  onChange={(e) => {
                      this.setState({
                        fullname: e.target.value,
                        error: '',
                      });
                      auth.error = '';
                  }
                  }
                />
              </CellBody>
            </FormCell>
            <FormCell>
              <CellHeader>
                <Label>性別</Label>
              </CellHeader>
              <CellBody>
                <Select
                  value={this.state.sex}
                  onChange={(e) => {
                            this.setState({
                              sex: e.target.value,
                              error: '',
                            });
                            auth.error = '';
                        }
                        }
                >
                  <option value="1">男</option>
                  <option value="2">女</option>
                </Select>
              </CellBody>
            </FormCell>
            <FormCell>
              <CellHeader>
                <Label>生年月日</Label>
              </CellHeader>
              <CellBody>
                <Input
                  type="date"
                  value={this.state.dob}
                  onChange={(e) => {
                      this.setState({
                        dob: e.target.value,
                        error: '',
                      });
                      auth.error = '';
                  }
                  }
                />
              </CellBody>
            </FormCell>
          </Form>
          <ButtonArea>
            <Button
              disabled={!(this.state.company_name && this.state.fullname && this.state.sex && this.state.dob) || loading}
              onClick={e => this.handleCertification()}
            >
              申请认证
            </Button>
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
  tokenLogin: info => dispatch(tokenLogin(info)),
  certification: info => dispatch(certification(info)),
  resetCertification: () => dispatch(resetCertification()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserCertification);
