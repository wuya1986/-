import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Link,
  withRouter,
} from 'react-router-dom';

import {
  CellsTitle,
  Form,
  FormCell,
  CellHeader,
  CellBody,
  CellFooter,
  Input,
  Label,
  Button,
  ButtonArea,
  Toast,
  Msg,
  Cells,
  Cell,
} from 'react-weui';

import Page from '../components/page';
import { tokenLogin } from '../actions/auth';
import { fetchTicketTemplate, addTicket, fetchLastTicketByTemplate } from '../actions/tickets';

class SettleInNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket_template: 'settle_in',
      settle_in_company: '',
      settle_in_unit_name: '',
      settle_in_number: '',
      settle_in_date: '',
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

  addTicket() {
    this.props.addTicket({
      form_data: {
        ...this.state,
      },
      company: this.state.settle_in_company,
      content: `${this.props.auth.user.company.company_name}${this.state.ticket_template === 'settle_in' ? '办理入驻' : '办理退租'}`,
      ticket_template: this.state.ticket_template,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { auth } = nextProps;
    if (auth && auth.user && auth.user.company && !this.state.settle_in_company) {
      this.setState({
        settle_in_company: auth.user.company._id,
        settle_in_unit_name: auth.user.company.company_name,
        settle_in_floor: auth.user.company.floor,
        settle_in_number: auth.user.company.number,
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
      ticket: {
        ticket,
      },
      tickets: {
        adding, error, added,
      },
    } = this.props;
    if (added && !this.state.showToast) {
      return (
        <Page className="msg_success" history={this.props.history}>
          <Msg
            type="success"
            title="申请完成"
            description="申请完成,稍后我们的工作人员会与您联系"
          />
        </Page>
      );
    }
    if (ticket) {
      return (
        <Page className="input" spacing history={this.props.history} ticket_indicates={ticket ? ticket.ticket_indicates : null}>
          <Cells>
            <Cell>
              <CellBody>
                租户名称
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_unit_name}
              </CellFooter>
            </Cell>
            <Cell>
              <CellBody>
                施工位置
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_floor}层{ticket.form_data.settle_in_number}号
              </CellFooter>
            </Cell>
          </Cells>
          <CellsTitle>运营服务部</CellsTitle>
          <Cells>
            <Cell>
              <CellBody>
                租户入住/变更通知表
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_service_type}
              </CellFooter>
            </Cell>
            <Cell>
              <CellBody>
                消防、安全、合规责任承诺书
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_service_commitment}
              </CellFooter>
            </Cell>
            <Cell>
              <CellBody>
                入住企业资料表
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_service_sheet}
              </CellFooter>
            </Cell>
            <Cell>
              <CellBody>
                大件物品进/出门条确认人签字模板
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_service_template}
              </CellFooter>
            </Cell>
          </Cells>
          <CellsTitle>工程部</CellsTitle>
          <Cells>
            <Cell>
              <CellBody>
                施工竣工验收表
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_project_acceptance}
              </CellFooter>
            </Cell>
            <Cell>
              <CellBody>
                竣工图
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_project_drawing}
              </CellFooter>
            </Cell>
            <Cell>
              <CellBody>
                其他
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_project_other}
              </CellFooter>
            </Cell>
          </Cells>
          <CellsTitle>安保</CellsTitle>
          <Cells>
            <Cell>
              <CellBody>
                已取得《北京市丰台区公安消防支队建设工程消防验收意见书》
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_security_submissions}
              </CellFooter>
            </Cell>
            <Cell>
              <CellBody>
                现场检查无安全隐患、外开窗已封闭
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_security_security}
              </CellFooter>
            </Cell>
            <Cell>
              <CellBody>
                现场灭火器等消防器具配置完善
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_security_fire_apparatus}
              </CellFooter>
            </Cell>
            <Cell>
              <CellBody>
                其他
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_security_other}
              </CellFooter>
            </Cell>
          </Cells>
          <Cells>
            <Cell>
              <CellBody>
                运营经理
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_service_manager}
              </CellFooter>
            </Cell>
            <Cell>
              <CellBody>
                确认日期
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_service_manager_date}
              </CellFooter>
            </Cell>
          </Cells>
          <Cells>
            <Cell>
              <CellBody>
                工程部经理
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_project_manager}
              </CellFooter>
            </Cell>
            <Cell>
              <CellBody>
                确认日期
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_project_manager_date}
              </CellFooter>
            </Cell>
          </Cells>
          <Cells>
            <Cell>
              <CellBody>
                安保部经理
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_security_manager}
              </CellFooter>
            </Cell>
            <Cell>
              <CellBody>
                确认日期
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_security_manager_date}
              </CellFooter>
            </Cell>
          </Cells>
          <Cells>
            <Cell>
              <CellBody>
                项目总经理
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_general_manager}
              </CellFooter>
            </Cell>
            <Cell>
              <CellBody>
                确认日期
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_in_general_manager_date}
              </CellFooter>
            </Cell>
          </Cells>
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
              <Label>企业名称</Label>
            </CellHeader>
            <CellBody>
              <Input
                type="text"
                value={this.state.settle_in_unit_name}
                onChange={e => this.setState({ settle_in_unit_name: e.target.value })}
              />
            </CellBody>
          </FormCell>
          <FormCell>
            <CellHeader>
              <Label>入驻日期</Label>
            </CellHeader>
            <CellBody>
              <Input
                type="date"
                defaultValue=""
                onChange={e => this.setState({ settle_in_date: e.target.value })}
              />
            </CellBody>
          </FormCell>
        </Form>
        <ButtonArea>
          <Button
            disabled={!(this.state.settle_in_date) || adding}
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
  ticket: state.ticket,
  tickets: state.tickets,
  ticket_template: state.ticket_template,
});

const mapDispatchToProps = dispatch => ({
  tokenLogin: info => dispatch(tokenLogin(info)),
  addTicket: data => dispatch(addTicket(data)),
  fetchTicketTemplate: id => dispatch(fetchTicketTemplate(id)),
  fetchLastTicketByTemplate: criteria => dispatch(fetchLastTicketByTemplate(criteria)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SettleInNew));
