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
import moment from 'moment';

import Page from '../components/page';
import { tokenLogin } from '../actions/auth';
import { fetchTicketTemplate, addTicket, resetTicket } from '../actions/tickets';

class IndividualVisitorNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket_template: 'batchly_visitor',
      batchly_visitor_company: '',
      batchly_visitor_name: '',
      batchly_visitor_date: '',
      batchly_visitor_number: 5,
      batchly_visitor_purpose: '',
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
      company: this.state.batchly_visitor_company,
      content: `${this.props.auth.user.company.company_name}批量访客: ${this.state.batchly_visitor_name}`,
      ticket_template: this.state.ticket_template,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { auth } = nextProps;
    if (auth && auth.user && auth.user.company && !this.state.batchly_visitor_company) {
      this.setState({
        batchly_visitor_company: auth.user.company._id,
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
              <Label>访客姓名</Label>
            </CellHeader>
            <CellBody>
              <Input type="text" onChange={e => this.setState({ batchly_visitor_name: e.target.value })} />
            </CellBody>
          </FormCell>
          {this.state.batchly_visitor_date && moment(this.state.batchly_visitor_date).isBefore(moment(), 'day') ? (
            <FormCell warn>
              <CellHeader>
                <Label>来访日期</Label>
              </CellHeader>
              <CellBody>
                <Input type="date" onChange={e => this.setState({ batchly_visitor_date: e.target.value })} />
              </CellBody>
            </FormCell>
          ) : (
            <FormCell>
              <CellHeader>
                <Label>来访日期</Label>
              </CellHeader>
              <CellBody>
                <Input type="date" onChange={e => this.setState({ batchly_visitor_date: e.target.value })} />
              </CellBody>
            </FormCell>
          )}
          <FormCell>
            <CellHeader>
              <Label>来访人数</Label>
            </CellHeader>
            <CellBody>
              <Input type="number" value={this.state.batchly_visitor_number} onChange={e => this.setState({ batchly_visitor_number: e.target.value })} />
            </CellBody>
          </FormCell>
          <FormCell>
            <CellBody>
              <TextArea
                rows="3"
                defaultValue={this.state.batchly_visitor_purpose}
                placeholder="来访目的"
                maxLength={200}
                onChange={e => this.setState({ batchly_visitor_purpose: e.target.value })}
              />
            </CellBody>
          </FormCell>
        </Form>
        <ButtonArea>
          <Button
            disabled={!(this.state.batchly_visitor_number >= 5
                     && this.state.batchly_visitor_name
                     && this.state.batchly_visitor_date
                     && this.state.batchly_visitor_purpose
                     && !moment(this.state.batchly_visitor_date).isBefore(moment(), 'day'))
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
