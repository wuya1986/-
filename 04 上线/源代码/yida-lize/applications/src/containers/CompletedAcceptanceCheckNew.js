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
  Toast,
} from 'react-weui';

import Page from '../components/page';
import { tokenLogin } from '../actions/auth';
import { fetchTicketTemplate, addTicket, resetTicket } from '../actions/tickets';

class CompletedAcceptanceCheckNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket_template: 'completed_acceptance_check',
      completed_acceptance_company: '',
      completed_acceptance_checks_type: '租户装修',
      completed_acceptance_checks_floor: '',
      completed_acceptance_checks_number: '',
      completed_acceptance_checks_area: '',
      completed_acceptance_checks_tenantry_unit_name: '',
      completed_acceptance_checks_tenantry_contact: '',
      completed_acceptance_checks_tenantry_tel: '',
      completed_acceptance_checks_construction_unit_name: '',
      completed_acceptance_checks_construction_contact: '',
      completed_acceptance_checks_construction_tel: '',
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
        settle_in_unit_name: this.props.auth.user.company.company_name,
      },
      company: this.state.completed_acceptance_company,
      content: `${this.props.auth.user.company.company_name}竣工验收申请`,
      ticket_template: this.state.ticket_template,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { auth } = nextProps;
    if (auth && auth.user && auth.user.company && !this.state.completed_acceptance_company) {
      this.setState({
        completed_acceptance_company: auth.user.company._id,
        completed_acceptance_checks_floor: auth.user.company.floor,
        completed_acceptance_checks_number: auth.user.company.number,
      }, function () {
        this.forceUpdate();
      });
    }
    return true;
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
            title="申请完成"
            description="申请完成,稍后我们的工作人员会进行审批"
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
              <Label>施工类别</Label>
            </CellHeader>
            <CellBody>
              <Select
                onChange={e => this.setState({ completed_acceptance_checks_type: e.target.value })}
                data={[
                  {
                    value: '租户装修',
                    label: '租户装修',
                  },
                  {
                    value: '项目委托施工',
                    label: '项目委托施工',
                  },
                  {
                    value: '外部单位项目内施工',
                    label: '外部单位项目内施工',
                  },
                ]}
              />
            </CellBody>
          </FormCell>
          <FormCell vcode>
            <CellHeader>
              <Label>施工位置</Label>
            </CellHeader>
            <CellBody>
              <Input
                type="number"
                value={this.state.completed_acceptance_checks_floor}
                onChange={e => this.setState({ completed_acceptance_checks_floor: e.target.value })}
              />
            </CellBody>
            <CellFooter>
              <Button type="vcode">层</Button>
            </CellFooter>
            <CellBody>
              <Input
                type="number"
                value={this.state.completed_acceptance_checks_number}
                onChange={e => this.setState({ completed_acceptance_checks_number: e.target.value })}
              />
            </CellBody>
            <CellFooter>
              <Button type="vcode">号</Button>
            </CellFooter>
          </FormCell>
          <FormCell>
            <CellHeader>
              <Label>区域</Label>
            </CellHeader>
            <CellBody>
              <Input
                type="text"
                onChange={e => this.setState({ completed_acceptance_checks_area: e.target.value })}
              />
            </CellBody>
          </FormCell>
          <FormCell>
            <CellHeader>
              <Label>租户/安排施工单位名称</Label>
            </CellHeader>
            <CellBody>
              <Input
                type="text"
                onChange={e => this.setState({ completed_acceptance_checks_tenantry_unit_name: e.target.value })}
              />
            </CellBody>
          </FormCell>
          <FormCell>
            <CellHeader>
              <Label>联系人</Label>
            </CellHeader>
            <CellBody>
              <Input
                type="text"
                onChange={e => this.setState({ completed_acceptance_checks_tenantry_contact: e.target.value })}
              />
            </CellBody>
          </FormCell>
          {this.state.completed_acceptance_checks_tenantry_tel && !(/^1\d{10}$/.test(this.state.completed_acceptance_checks_tenantry_tel)) ? (
            <FormCell warn>
              <CellHeader>
                <Label>联系电话</Label>
              </CellHeader>
              <CellBody>
                <Input
                  type="tel"
                  onChange={e => this.setState({ completed_acceptance_checks_tenantry_tel: e.target.value })}
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
                  onChange={e => this.setState({ completed_acceptance_checks_tenantry_tel: e.target.value })}
                />
              </CellBody>
            </FormCell>
          )}
          <FormCell>
            <CellHeader>
              <Label>施工单位名称</Label>
            </CellHeader>
            <CellBody>
              <Input
                type="text"
                onChange={e => this.setState({ completed_acceptance_checks_construction_unit_name: e.target.value })}
              />
            </CellBody>
          </FormCell>
          <FormCell>
            <CellHeader>
              <Label>联系人</Label>
            </CellHeader>
            <CellBody>
              <Input
                type="text"
                onChange={e => this.setState({ completed_acceptance_checks_construction_contact: e.target.value })}
              />
            </CellBody>
          </FormCell>
          {this.state.completed_acceptance_checks_construction_tel && !(/^1\d{10}$/.test(this.state.completed_acceptance_checks_construction_tel)) ? (
            <FormCell warn>
              <CellHeader>
                <Label>联系电话</Label>
              </CellHeader>
              <CellBody>
                <Input
                  type="tel"
                  onChange={e => this.setState({ completed_acceptance_checks_construction_tel: e.target.value })}
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
                  onChange={e => this.setState({ completed_acceptance_checks_construction_tel: e.target.value })}
                />
              </CellBody>
            </FormCell>
          )}
        </Form>
        <ButtonArea>
          <Button
            disabled={!(this.state.completed_acceptance_checks_type
                     && this.state.completed_acceptance_checks_floor
                     && this.state.completed_acceptance_checks_number
                     && this.state.completed_acceptance_checks_area
                     && this.state.completed_acceptance_checks_tenantry_unit_name
                     && this.state.completed_acceptance_checks_tenantry_contact
                     && this.state.completed_acceptance_checks_tenantry_tel
                     && (/^1\d{10}$/.test(this.state.completed_acceptance_checks_tenantry_tel))
                     && this.state.completed_acceptance_checks_construction_unit_name
                     && this.state.completed_acceptance_checks_construction_contact
                     && this.state.completed_acceptance_checks_construction_tel
                     && (/^1\d{10}$/.test(this.state.completed_acceptance_checks_construction_tel)))
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CompletedAcceptanceCheckNew));
