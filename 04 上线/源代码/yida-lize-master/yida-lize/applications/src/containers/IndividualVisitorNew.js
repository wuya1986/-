import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  withRouter,
} from 'react-router-dom';

import {
  Button,
  ButtonArea,
  CellBody,
  CellHeader,
  CellsTitle,
  Form,
  FormCell,
  Input,
  Label,
  Msg,
  TextArea,
  Toast,
} from 'react-weui';
import QRCode from 'qrcode.react';
import moment from 'moment';

import Page from '../components/page';
import { tokenLogin } from '../actions/auth';
import { fetchTicketTemplate, addTicket, resetTicket } from '../actions/tickets';
import constants from '../constants/';

// http://localhost:3000/tickets/new/individual_visitor
class IndividualVisitorNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket_template: 'individual_visitor',
      individual_visitor_company: '',
      individual_visitor_name: '',
      individual_visitor_date: '',
      individual_visitor_purpose: '',
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
    this.props.fetchTicketTemplate(this.state.ticket_template);
  }

  componentWillUnmount() {
    this.props.resetTicket();
    this.state.toastTimer && clearTimeout(this.state.toastTimer);
  }

  addTicket() {
    this.props.addTicket({
      form_data: { ...this.state },
      company: this.state.individual_visitor_company,
      progress: '处理完毕',
      content: `${this.props.auth.user.company.company_name}个人访客: ${this.state.individual_visitor_name}`,
      ticket_template: this.state.ticket_template,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { auth } = nextProps;
    if (auth && auth.user && auth.user.company && !this.state.individual_visitor_company) {
      this.setState({
        individual_visitor_company: auth.user.company._id,
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
      tickets: {
        adding, error, added, new_ticket,
      },
    } = this.props;
    if (added && !this.state.showToast) {
      return (
        <Page className="msg_success" history={this.props.history}>
          <Msg
            type="success"
            title="申请完成"
            description="申请成功,请截屏并把此二维码发送给访客。"
          />
          <div style={{ textAlign: 'center' }}>
            <QRCode value={`${constants.REMOTE_URL}/crud/property_repair/${new_ticket._id}`} />
          </div>
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
              <Label>访客姓名</Label>
            </CellHeader>
            <CellBody>
              <Input type="text" onChange={e => this.setState({ individual_visitor_name: e.target.value })} />
            </CellBody>
          </FormCell>
          {this.state.individual_visitor_date && moment(this.state.individual_visitor_date).isBefore(moment(), 'day') ? (
            <FormCell warn>
              <CellHeader>
                <Label>来访日期</Label>
              </CellHeader>
              <CellBody>
                <Input type="date" onChange={e => this.setState({ individual_visitor_date: e.target.value })} />
              </CellBody>
            </FormCell>
          ) : (
            <FormCell>
              <CellHeader>
                <Label>来访日期</Label>
              </CellHeader>
              <CellBody>
                <Input type="date" onChange={e => this.setState({ individual_visitor_date: e.target.value })} />
              </CellBody>
            </FormCell>
          )}
          <FormCell>
            <CellBody>
              <TextArea
                placeholder="来访目的"
                defaultValue={this.state.individual_visitor_purpose}
                rows="3"
                maxLength={200}
                onChange={e => this.setState({ individual_visitor_purpose: e.target.value })}
              />
            </CellBody>
          </FormCell>
        </Form>
        <ButtonArea>
          <Button
            disabled={!(this.state.individual_visitor_name
                     && this.state.individual_visitor_date
                     && this.state.individual_visitor_purpose
                     && !moment(this.state.individual_visitor_date).isBefore(moment(), 'day'))
                   || adding}
            onClick={e => this.addTicket()}
          >
            提交申请
          </Button>
        </ButtonArea>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  tickets: state.tickets,
  ticket_template: state.ticket_template,
});

const mapDispatchToProps = dispatch => ({
  tokenLogin: info => dispatch(tokenLogin(info)),
  addTicket: data => dispatch(addTicket(data)),
  fetchTicketTemplate: id => dispatch(fetchTicketTemplate(id)),
  resetTicket: () => dispatch(resetTicket()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(IndividualVisitorNew));
