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
  Label,
  Msg,
  Select,
  TextArea,
  Toast,
} from 'react-weui';

import Page from '../components/page';
import { tokenLogin } from '../actions/auth';
import { fetchTicketTemplate, addTicket, resetTicket } from '../actions/tickets';

class ComplaintAdviceNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket_template: 'complaint_advice',
      complaint_advice_company: '',
      complaint_advice_type: '物业服务人员',
      complaint_advice_content: '',
      complaint_advice_proposal: '',
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
      company: this.state.complaint_advice_company,
      content: `${this.props.auth.user.company.company_name}投诉建议: ${this.state.complaint_advice_content}`,
      ticket_template: this.state.ticket_template,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { auth } = nextProps;
    if (auth && auth.user && auth.user.company && !this.state.complaint_advice_company) {
      this.setState({
        complaint_advice_company: auth.user.company._id,
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
            title="投诉完成"
            description="投诉成功,稍后我们的工作人员为您处理"
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
          <FormCell select selectPos="after">
            <CellHeader>
              <Label>投诉类型</Label>
            </CellHeader>
            <CellBody>
              <Select
                onChange={e => this.setState({ complaint_advice_type: e.target.value })}
                data={[
                  {
                    value: '物业服务人员',
                    label: '物业服务人员',
                  },
                  {
                    value: '设施设备',
                    label: '设施设备',
                  },
                  {
                    value: '安全保障',
                    label: '安全保障',
                  },
                  {
                    value: '环境卫生',
                    label: '环境卫生',
                  },
                  {
                    value: '施工噪音',
                    label: '施工噪音',
                  },
                  {
                    value: '其它',
                    label: '其它',
                  },
                ]}
              />
            </CellBody>
          </FormCell>
          <FormCell>
            <CellBody>
              <TextArea
                rows="3"
                placeholder="投诉内容"
                defaultValue={this.state.complaint_advice_content}
                maxLength={200}
                onChange={e => this.setState({ complaint_advice_content: e.target.value })}
              />
            </CellBody>
          </FormCell>
          <FormCell>
            <CellBody>
              <TextArea
                rows="3"
                defaultValue={this.state.complaint_advice_proposal}
                placeholder="修改建议"
                maxLength={200}
                onChange={e => this.setState({ complaint_advice_proposal: e.target.value })}
              />
            </CellBody>
          </FormCell>
        </Form>
        <ButtonArea>
          <Button
            disabled={!(this.state.complaint_advice_type && this.state.complaint_advice_content && this.state.complaint_advice_proposal) || adding}
            onClick={e => this.addTicket()}
          >
            投诉
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ComplaintAdviceNew));
