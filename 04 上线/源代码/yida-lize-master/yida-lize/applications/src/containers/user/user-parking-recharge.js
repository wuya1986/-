import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Button,
  ButtonArea,
  Form,
  FormCell,
  Input,
  Label,
  Select,
  Page,
  CellBody,
  CellHeader,
  CellsTitle,
  Toast,
} from 'react-weui';

import {
  unified as wxUnified,
} from '../../wx';

class UserParkingRecharge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recharge_type: 'parking_recharge',
      vpl_number: '',
      total_month: 1
    };
  }

  componentWillUnmount() {
    this.state.toastTimer && clearTimeout(this.state.toastTimer);
  }

  showToast(msg) {
    this.setState({
      showToast: true,
      showToastMsg: msg,
    });

    this.state.toastTimer = setTimeout(() => {
      this.setState({
        showToast: false,
        showToastMsg: '',
      });
    }, 2000);
  }
  unify(e) {
    wxUnified(this.state, (error, json) => {
      if (!error) {
        this.showToast('充值成功');
      } else if (json.err_msg) {
        this.showToast(json.err_msg);
      }
    });
  }
  render() {
    return (
      <Page>
        <CellsTitle>车位月卡续费</CellsTitle>
        <Form>
          <FormCell>
            <CellHeader>
              <Label>车牌号</Label>
            </CellHeader>
            <CellBody>
              <Input
                type="text"
                placeholder="请输入您的车牌号码"
                onKeyUp={e => this.setState({
                  vpl_number: e.target.value,
                })}
              />
            </CellBody>
          </FormCell>
          <FormCell>
            <CellHeader>
              <Label>时长</Label>
            </CellHeader>
            <CellBody>
              <Select
                value={this.state.sex}
                onChange={(e) => {
                  this.setState({
                    total_month: e.target.value,
                  });
                }}
              >
                <option value="1">一个月</option>
                <option value="3">三个月</option>
                <option value="6">六个月</option>
                <option value="12">一年</option>
              </Select>
            </CellBody>
          </FormCell>
        </Form>
        <ButtonArea>
          <Toast icon="success-no-circle" show={this.state.showToast}>{this.state.showToastMsg}</Toast>
          <Button
            disabled={!(/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(this.state.vpl_number))}
            onClick={e => this.unify(e)}
          >
            立即支付
          </Button>
        </ButtonArea>
      </Page>
    );
  }
}


const mapStateToProps = state => ({
});
const mapDispatchToProps = (dispatch, ownProps) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(UserParkingRecharge);
