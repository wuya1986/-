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

class DepositRefundShow extends Component {
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
                      <p>{ticket.form_data.deposit_refund_type}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>施工位置</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_floor}层{ticket.form_data.deposit_refund_number}号</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>区域</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_area}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>租户/安排施工单位名称</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_tenantry_unit_name}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>联系人</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_tenantry_contact}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>联系电话</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_tenantry_tel}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>电费承担</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_afford_expense}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>承担方确认</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_afford_expense_approved}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>施工单位名称</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_construction_unit_name}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>联系人</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_construction_contact}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>联系电话</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_construction_tel}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <PanelHeader>
                  工程部审批信息
              </PanelHeader>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>已附《施工竣工验收表》</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_repair_approved}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>已提交完整竣工图纸</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_drawing_approved_1}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>已拆除围挡及成品保护</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_remove_approved}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>周边无公共区域损坏情形</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_periphery_approved}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>工程部经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_repair_approved_manager}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>工程部经理审批日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_repair_approved_date}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <PanelHeader>
                  安保部审批信息
              </PanelHeader>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>已提交完整竣工图纸</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_drawing_approved_2}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>对消防、监控、安防系统无损坏情形</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_fire_approved}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>安保部经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_security_approved_manager}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>安保部经理审批日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_security_approved_date}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <PanelHeader>
                  运营部审批信息
              </PanelHeader>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>已集中退还一卡通（不再单独办理）</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_card_approved}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>周边环境无污染、无占用</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_contaminated_approved}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>运营部经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_building_approved_manager}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>运营部经理审批日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_building_approved_date}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <PanelHeader>
                  结算明细信息
              </PanelHeader>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>装修履约保证金</p>
                    </CellBody>
                    <CellFooter>
                      <p>缴费额{ticket.form_data.deposit_amount}元</p>
                      <p>退还金额{ticket.form_data.deposit_return_amount}元</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>施工人员一卡通</p>
                    </CellBody>
                    <CellFooter>
                      <p>缴费额{ticket.form_data.card_amount}元</p>
                      <p>退还金额{ticket.form_data.card_return_amount}元</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>施工期间电费</p>
                    </CellBody>
                    <CellFooter>
                      <p>缴费额{ticket.form_data.electricity_fee_amount}元</p>
                      <p>退还金额{ticket.form_data.electricity_fee_return_amount}元</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>泄水费</p>
                    </CellBody>
                    <CellFooter>
                      <p>缴费额{ticket.form_data.drainage_fee_amount}元</p>
                      <p>退还金额{ticket.form_data.drainage_fee_return_amount}元</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>现场管理罚金</p>
                    </CellBody>
                    <CellFooter>
                      <p>缴费额{ticket.form_data.amercement_amount}元</p>
                      <p>退还金额{ticket.form_data.amercement_return_amount}元</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>设备设施损坏维修费</p>
                    </CellBody>
                    <CellFooter>
                      <p>缴费额{ticket.form_data.repair_fee_amount}元</p>
                      <p>退还金额{ticket.form_data.repair_fee_return_amount}元</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <PanelHeader>
                  结算信息
              </PanelHeader>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>结算金额</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.total_amount}元</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>工程部经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_repair_manager}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>安保部经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_security_manager}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>运营服务部经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_building_manager}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>财务总监</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_fee_confirmer}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>项目总经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.deposit_refund_chief_manager}</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DepositRefundShow));
