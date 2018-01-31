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
  Toast,
} from 'react-weui';

import Page from '../components/page';
import { tokenLogin } from '../actions/auth';
import { fetchTicketTemplate, addTicket, resetTicket } from '../actions/tickets';

class PropertyRepairNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket_template: 'property_repair',
      property_repair_company: '',
      property_repair_company_name: '',
      property_repair_user: '',
      property_repair_content: '',
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
      company: this.state.property_repair_company,
      content: `${this.props.auth.user.company.company_name}报修维修:${this.state.property_repair_content}`,
      ticket_template: this.state.ticket_template,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { auth } = nextProps;
    if (auth && auth.user && auth.user.company && !this.state.property_repair_company) {
      this.setState({
        property_repair_company: auth.user.company._id,
        property_repair_company_name: auth.user.company.company_name,
        property_repair_floor: auth.user.company.floor,
        property_repair_number: auth.user.company.number,
        property_repair_user: auth.user.fullname,
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
            title="报修完成"
            description="报修成功,稍后我们的工作人员会与您联系"
          />
        </Page>
      );
    }
    return (
      <Page className="input" spacing history={this.props.history}>
        <Toast icon="loading" show={adding || loading}>Loading...</Toast>
        <Toast icon="warn" show={error}>{error}</Toast>
        <CellsTitle dangerouslySetInnerHTML={{ __html: ticket_template.user_guide }} />
        <Form>
          <FormCell>
            <CellHeader>
              <Label>租户名称</Label>
            </CellHeader>
            <CellBody>
              <Input
                type="text"
                value={this.state.property_repair_company_name}
                onChange={e => this.setState({ property_repair_company_name: e.target.value })}
              />
            </CellBody>
          </FormCell>
          <FormCell>
            <CellHeader>
              <Label>租户位置</Label>
            </CellHeader>
            <CellBody>
              <Input
                type="number"
                value={this.state.property_repair_floor}
                onChange={e => this.setState({ property_repair_floor: e.target.value })}
              />
            </CellBody>
            <CellFooter>
              <Button type="vcode">层</Button>
            </CellFooter>
            <CellBody>
              <Input
                type="number"
                value={this.state.property_repair_number}
                onChange={e => this.setState({ property_repair_number: e.target.value })}
              />
            </CellBody>
            <CellFooter>
              <Button type="vcode">号</Button>
            </CellFooter>
          </FormCell>
          <FormCell>
            <CellHeader>
              <Label>报修人</Label>
            </CellHeader>
            <CellBody>
              <Input
                type="text"
                value={this.state.property_repair_user}
                onChange={e => this.setState({ property_repair_user: e.target.value })}
              />
            </CellBody>
          </FormCell>
          <FormCell>
            <CellBody>
              <TextArea
                placeholder="报修内容"
                rows="3"
                maxLength={200}
                onChange={e => this.setState({ property_repair_content: e.target.value })}
              />
            </CellBody>
          </FormCell>
        </Form>
        <ButtonArea>
          <Button
            disabled={!(this.state.property_repair_company_name &&
                        this.state.property_repair_user &&
                        this.state.property_repair_floor &&
                        this.state.property_repair_number &&
                        this.state.property_repair_content)
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PropertyRepairNew));
