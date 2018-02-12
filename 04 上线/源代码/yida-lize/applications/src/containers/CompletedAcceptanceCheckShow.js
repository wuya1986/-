import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
  Button,
  ButtonArea,
  Cell,
  CellBody,
  CellFooter,
  CellHeader,
  Cells,
  MediaBox,
  Panel,
  PanelBody,
  PanelHeader,
  Toast,
} from 'react-weui';

import Page from '../components/page';
import {
  fetchTicket,
} from '../actions/tickets';

class CompletedAcceptanceCheckShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket_id: props.match.params.ticket_id,
      content: '',
    };
  }

  componentDidMount() {
    this.props.fetchTicket(this.state.ticket_id);
  }

  render() {
    const {
      ticket: {
        ticket, loading, error,
      },
    } = this.props;
    return (
      <Page className="preview" history={this.props.history} ticket_indicates={ticket ? ticket.ticket_indicates : null}>
        <Toast icon="loading" show={loading}>Loading...</Toast>
        {
          error ? (<div className="alert alert-danger">Error: {error}</div>) : null
        }
        { ticket ? (
          <Panel>
            <PanelBody>
              <PanelHeader>
                  基本信息
              </PanelHeader>
              <MediaBox type="small_appmsg">
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
                      <p>施工类别</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.completed_acceptance_checks_type}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>施工位置</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.completed_acceptance_checks_floor}层{ticket.form_data.completed_acceptance_checks_number}号</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>区域</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.completed_acceptance_checks_area}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>租户/安排施工单位名称</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.completed_acceptance_checks_tenantry_unit_name}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>联系人</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.completed_acceptance_checks_tenantry_contact}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>联系电话</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.completed_acceptance_checks_tenantry_tel}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>施工单位名称</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.completed_acceptance_checks_construction_unit_name}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>联系人</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.completed_acceptance_checks_construction_contact}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>联系电话</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.completed_acceptance_checks_construction_tel}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <PanelHeader>
                  初步验收结论信息
              </PanelHeader>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>初步验收结论</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.completed_acceptance_checks_result}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>待整改项</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.completed_acceptance_checks_rectification_items}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>工程部经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.completed_acceptance_checks_repair_manager}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>安保部经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.completed_acceptance_checks_security_manager}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>项目总经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.completed_acceptance_checks_chief_manager}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <PanelHeader>
                  复检结论信息
              </PanelHeader>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>复检结论</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.completed_acceptance_checks_retest_result}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>工程部经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.completed_acceptance_checks_retest_repair_manager}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>安保部经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.completed_acceptance_checks_retest_security_manager}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>项目总经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.completed_acceptance_checks_retest_chief_manager}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
            </PanelBody>
          </Panel>
        ) : null
        }
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  ticket: state.ticket,
});

const mapDispatchToProps = dispatch => ({
  fetchTicket: id => dispatch(fetchTicket(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CompletedAcceptanceCheckShow));
