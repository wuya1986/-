import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  withRouter,
} from 'react-router-dom';

import {
  Cell,
  CellBody,
  CellFooter,
  Cells,
  Msg,
} from 'react-weui';

import Page from '../components/page';
import { tokenLogin } from '../actions/auth';
import { fetchTicketTemplate, fetchLastTicketByTemplate } from '../actions/tickets';

class SettleInNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket_template: 'settle_out',
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
        error, added,
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
                <p>状态</p>
              </CellBody>
              <CellFooter>
                <p>{ticket.progress}</p>
              </CellFooter>
            </Cell>
            <Cell>
              <CellBody>
                租户名称
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_out_unit_name}
              </CellFooter>
            </Cell>
            <Cell>
              <CellBody>
                租用位置
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_out_floor}层{ticket.form_data.settle_out_number}号
              </CellFooter>
            </Cell>
          </Cells>
          <Cells>
            <Cell>
              <CellBody>
                项目总经理
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_out_general_manager}
              </CellFooter>
            </Cell>
            <Cell>
              <CellBody>
                审批意见
              </CellBody>
              <CellFooter>
                {ticket.form_data.settle_out_approval_comments}
              </CellFooter>
            </Cell>
          </Cells>
        </Page>
      );
    }
    return null;
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
  fetchTicketTemplate: id => dispatch(fetchTicketTemplate(id)),
  fetchLastTicketByTemplate: criteria => dispatch(fetchLastTicketByTemplate(criteria)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SettleInNew));
