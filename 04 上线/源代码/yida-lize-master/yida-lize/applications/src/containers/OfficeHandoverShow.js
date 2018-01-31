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
  CellsTitle,
  MediaBox,
  Panel,
  PanelBody,
  PanelHeader,
  Toast,
} from 'react-weui';

import Page from '../components/page';
import {
  addTicketClosed,
  resetTicket,
  fetchTicket,
} from '../actions/tickets';

class OfficeHandoverShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket_id: props.match.params.ticket_id,
      user_closed: true,
    };
  }

  componentWillUnmount() {
    this.state.toastTimer && clearTimeout(this.state.toastTimer);
  }

  componentDidMount() {
    this.props.fetchTicket(this.state.ticket_id);
  }
  delayReset() {
    const history = this.props.history;
    this.state.toastTimer = setTimeout(() => {
      this.props.resetTicket();
      history.goBack();
    }, 2000);
  }

  addTicketClosed() {
    this.props.addTicketClosed({
      ...this.state,
    });
  }

  render() {
    const {
      tickets: {
        adding, added,
      },
      ticket: {
        ticket, loading, error,
      },
    } = this.props;
    if (added) {
      this.delayReset();
    }
    return (
      <Page className="preview" history={this.props.history} ticket_indicates={ticket ? ticket.ticket_indicates : null}>
        <Toast icon="success-no-circle" show={added}>确认成功</Toast>
        <Toast icon="loading" show={adding || loading}>Loading...</Toast>
        {
          error ? (<div className="alert alert-danger">Error: {error}</div>) : null
        }
        { ticket ? (
          <Panel>
            <PanelBody>
              <PanelHeader>
                  结构装饰
              </PanelHeader>
              <CellsTitle>门、门框、门锁、合叶、把手等</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_doors_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_doors_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_doors_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_doors_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>窗户、窗框、玻璃、窗户把手等</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_window_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_window_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_window_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_window_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>窗台台面</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_windowsill_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_windowsill_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_windowsill_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_windowsill_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>承重柱、墙</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_bearing_wall_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_bearing_wall_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_bearing_wall_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_bearing_wall_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>墙面</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_wall_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_wall_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_wall_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_wall_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>天花</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_ceiling_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_ceiling_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_ceiling_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_ceiling_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>地面</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_ground_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_ground_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_ground_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_ground_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>护栏</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_fence_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_fence_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_fence_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_fence_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <PanelHeader>
                  暖通
              </PanelHeader>
              <CellsTitle>送风口</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_outlet_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_outlet_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_outlet_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_outlet_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>回风口</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_inlet_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_inlet_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_inlet_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_inlet_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>风机盘管及恒温控制器</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_controller_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_controller_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_controller_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_controller_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <PanelHeader>
                  消防
              </PanelHeader>
              <CellsTitle>消防喷淋头</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_nozzle_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_nozzle_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_nozzle_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_nozzle_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>室内消火栓</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_hydrant_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_hydrant_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_hydrant_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_hydrant_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>消防广播</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_radio_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_radio_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_radio_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_radio_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>烟感、温感等感应器</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_sensor_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_sensor_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_sensor_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_sensor_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>排烟风口、正压送风口及阀</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_exhaust_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_exhaust_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_exhaust_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_exhaust_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>安全出口指示灯</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_indicator_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_indicator_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_indicator_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_indicator_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>电气</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_lamp_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_lamp_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_lamp_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_lamp_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>照明开关</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_switch_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_switch_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_switch_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_switch_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>插座</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_socket_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_socket_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_socket_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_socket_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>电力配电箱</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_distribution_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_distribution_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_distribution_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_distribution_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>电话、网络接线箱</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_junction_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_junction_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_junction_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_junction_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <PanelHeader>
                  其他
              </PanelHeader>
              <CellsTitle>水表号码</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_water_meter_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_water_meter_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_water_meter_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_water_meter_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>电表号码</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_ammeter_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_ammeter_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_ammeter_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_ammeter_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>钥匙</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>单位</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_key_unit}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>数量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_key_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>合格情况</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_key_compliance}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_key_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <CellsTitle>确认人</CellsTitle>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>工程部经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_repair_manager}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>安保部经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_security_manager}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>运营服务部经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.office_handover_building_manager}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
            </PanelBody>
          </Panel>
        ) : null
        }
        <ButtonArea>
          { ticket ? (
            <Button
              type="warn"
              disabled={ticket.user_closed || ticket.progress != '处理完毕' || adding}
              onClick={e => this.addTicketClosed()}
            >
                确认
            </Button>
          ) : null
          }
        </ButtonArea>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  ticket: state.ticket,
  tickets: state.tickets,
});

const mapDispatchToProps = dispatch => ({
  fetchTicket: id => dispatch(fetchTicket(id)),
  addTicketClosed: data => dispatch(addTicketClosed(data)),
  resetTicket: () => dispatch(resetTicket()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OfficeHandoverShow));
