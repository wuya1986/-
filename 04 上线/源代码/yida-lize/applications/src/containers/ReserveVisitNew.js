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
  Select,
} from 'react-weui';

import moment from 'moment';
import Page from '../components/page';
import { tokenLogin } from '../actions/auth';
import { fetchTicketTemplate, addTicket, resetTicket } from '../actions/tickets';

// http://localhost:3000/tickets/new/reserve_visit
class ReserveVisitNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket_template: 'reserve_visit',
      company_name: '',
      reserve_type: '参观拜访',
      contact: '',
      tel: '',
      total: '',
      reserve_date: '',
      content: '',
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
      form_data: {
        ...this.state,
      },
      content: `${this.state.company_name}申请预约参观`,
      ticket_template: this.state.ticket_template,
    });
  }

  render() {
    const {
      auth,
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
            title="预约完成"
            description="预约成功,稍后我们的工作人员会与您联系"
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
              <Label>来访单位</Label>
            </CellHeader>
            <CellBody>
              <Input type="text" onChange={e => this.setState({ company_name: e.target.value })} />
            </CellBody>
          </FormCell>
          <FormCell>
            <CellHeader>
              <Label>联系人</Label>
            </CellHeader>
            <CellBody>
              <Input type="text" onChange={e => this.setState({ contact: e.target.value })} />
            </CellBody>
          </FormCell>
          {this.state.tel && !(/^1\d{10}$/.test(this.state.tel)) ? (
            <FormCell warn>
              <CellHeader>
                <Label>手机</Label>
              </CellHeader>
              <CellBody>
                <Input type="tel" onChange={e => this.setState({ tel: e.target.value })} />
              </CellBody>
            </FormCell>
          ) : (
            <FormCell>
              <CellHeader>
                <Label>手机</Label>
              </CellHeader>
              <CellBody>
                <Input type="tel" onChange={e => this.setState({ tel: e.target.value })} />
              </CellBody>
            </FormCell>
          )}
          <FormCell>
            <CellHeader>
              <Label>来访人数</Label>
            </CellHeader>
            <CellBody>
              <Input type="number" onChange={e => this.setState({ total: e.target.value })} />
            </CellBody>
          </FormCell>
          {this.state.reserve_date && moment(this.state.reserve_date).isBefore(moment(), 'day') ? (
            <FormCell warn>
              <CellHeader>
                <Label>预约日期</Label>
              </CellHeader>
              <CellBody>
                <Input type="date" defaultValue="" onChange={e => this.setState({ reserve_date: e.target.value })} />
              </CellBody>
            </FormCell>
          ) : (
            <FormCell>
              <CellHeader>
                <Label>预约日期</Label>
              </CellHeader>
              <CellBody>
                <Input type="date" defaultValue="" onChange={e => this.setState({ reserve_date: e.target.value })} />
              </CellBody>
            </FormCell>
          )}
          <FormCell>
            <CellHeader>
              <Label>参观种类</Label>
            </CellHeader>
            <CellBody>
              <Select
                onChange={e => this.setState({ reserve_type: e.target.value })}
                data={[
                  {
                    value: '参观拜访',
                    label: '参观拜访',
                  },
                  {
                    value: '商务合作',
                    label: '商务合作',
                  },
                  {
                    value: '新闻采访',
                    label: '新闻采访',
                  },
                  {
                    value: '其他',
                    label: '其他',
                  },
                ]}
              />
            </CellBody>
          </FormCell>
          <FormCell>
            <CellBody>
              <TextArea
                placeholder="备注信息"
                defaultValue={this.state.content}
                rows="3"
                maxLength={200}
                onChange={e => this.setState({ content: e.target.value })}
              />
            </CellBody>
          </FormCell>
        </Form>
        <ButtonArea>
          <Button
            disabled={!(this.state.company_name
                  && this.state.contact
                  && this.state.tel
                  && (/^1\d{10}$/.test(this.state.tel))
                  && this.state.total
                  && this.state.reserve_date
                     && !moment(this.state.reserve_date).isBefore(moment(), 'day'))
            || adding}
            onClick={e => this.addTicket()}
          >
            预约
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReserveVisitNew));
