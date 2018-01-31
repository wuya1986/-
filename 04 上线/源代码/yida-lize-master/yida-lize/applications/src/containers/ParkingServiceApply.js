import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  withRouter,
} from 'react-router-dom';

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
  Msg,
  Select,
  TextArea,
  Cells,
  Cell,
  Toast,
} from 'react-weui';

import Page from '../components/page';
import { tokenLogin } from '../actions/auth';
import { fetchTicketTemplate, fetchLastTicketByTemplate, addTicket, resetTicket } from '../actions/tickets';

class ParkingServiceApply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket_template: 'parking_apply',
      parking_apply_company: '',
      parking_apply_fullname: '',
      parking_apply_mobile: '',
      parking_apply_vpl_number: '',
      toastTimer: null,
    };
  }

  componentDidMount() {
    if (!this.props.auth.user || !this.props.auth.user.mobile_no) {
      const token = localStorage.getItem('g_token');
      this.props.tokenLogin({
        token,
      });
    }
    this.props.fetchLastTicketByTemplate(this.state.ticket_template);
    this.props.fetchTicketTemplate(this.state.ticket_template);
  }

  componentWillUnmount() {
    this.props.resetTicket();
    this.state.toastTimer && clearTimeout(this.state.toastTimer);
  }

  delayReset() {
    const history = this.props.history;
    this.state.toastTimer = setTimeout(() => {
      // back
      history.goBack();
    }, 2000);
  }

  addTicket() {
    this.props.addTicket({
      form_data: { ...this.state },
      company: this.state.parking_apply_company,
      content: `${this.props.auth.user.company.company_name}月卡申请: ${this.state.parking_apply_vpl_number}`,
      ticket_template: this.state.ticket_template,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { auth } = nextProps;
    if (auth && auth.user && auth.user.company && !this.state.parking_apply_company) {
      this.setState({
        parking_apply_company: auth.user.company._id,
      }, function () {
        this.forceUpdate();
      });
    }
    return true;
  }

  render() {
    const {
      ticket_template: {
        ticket_template, loading,
      },
      ticket: {
        ticket
      },
      tickets: {
        adding, error, added,
      },
    } = this.props;
    if (added) {
      this.delayReset();
    }
    if (added && !this.state.showToast) {
      return (
        <Page className="msg_success" history={this.props.history}>
          <Msg
            type="success"
            title="申请完成"
            description="申请成功,稍后我们的工作人员会进行处理"
          />
        </Page>
      );
    }
    return (
      <Page className="input" spacing history={this.props.history}>
        <Toast icon="warn" show={error}>{error}</Toast>
        <Toast icon="loading" show={adding || loading}>Loading...</Toast>
        <CellsTitle dangerouslySetInnerHTML={{ __html: ticket_template.user_guide }} />
        <Form>
          <FormCell>
            <CellHeader>
              <Label>申请者姓名</Label>
            </CellHeader>
            <CellBody>
              <Input
                type="text"
                onChange={e => this.setState({ parking_apply_fullname: e.target.value })}
              />
            </CellBody>
          </FormCell>
          {this.state.parking_apply_mobile && !(/^1\d{10}$/.test(this.state.parking_apply_mobile)) ? (
            <FormCell warn>
              <CellHeader>
                <Label>联系电话</Label>
              </CellHeader>
              <CellBody>
                <Input
                  type="tel"
                  onChange={e => this.setState({ parking_apply_mobile: e.target.value })}
                />
              </CellBody>
            </FormCell>
          ) : (
            <FormCell>
              <CellHeader>
                <Label>联系电话</Label>
              </CellHeader>
              <CellBody>
                <Input
                  type="tel"
                  onChange={e => this.setState({ parking_apply_mobile: e.target.value })}
                />
              </CellBody>
            </FormCell>
          )}
          <FormCell>
            <CellHeader>
              <Label>车牌号码</Label>
            </CellHeader>
            <CellBody>
              <Input
                type="text"
                value={this.state.parking_apply_vpl_number}
                onChange={e => this.setState({ parking_apply_vpl_number: e.target.value })}
              />
            </CellBody>
          </FormCell>
        </Form>
        <ButtonArea>
          <Button
            disabled={!(this.state.parking_apply_fullname && this.state.parking_apply_mobile && this.state.parking_apply_vpl_number && (/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(this.state.parking_apply_vpl_number))) || adding}
            onClick={e => this.addTicket()}
          >
            提交申请
          </Button>
        </ButtonArea>
        {ticket ? (
          <Cells>
            <Cell>
              <CellBody>
                车牌号码
              </CellBody>
              <CellFooter>
                {ticket.form_data.parking_apply_vpl_number}
              </CellFooter>
            </Cell>
            <Cell>
              <CellBody>
                审批结果
              </CellBody>
              <CellFooter>
                {ticket.form_data.parking_apply_result}
              </CellFooter>
            </Cell>
          </Cells>
        ) : null
        }
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  ticket: state.ticket,
  tickets: state.tickets,
  ticket_template: state.ticket_template,
});

const mapDispatchToProps = dispatch => ({
  tokenLogin: info => dispatch(tokenLogin(info)),
  addTicket: data => dispatch(addTicket(data)),
  fetchTicketTemplate: id => dispatch(fetchTicketTemplate(id)),
  fetchLastTicketByTemplate: criteria => dispatch(fetchLastTicketByTemplate(criteria)),
  resetTicket: () => dispatch(resetTicket()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ParkingServiceApply));
