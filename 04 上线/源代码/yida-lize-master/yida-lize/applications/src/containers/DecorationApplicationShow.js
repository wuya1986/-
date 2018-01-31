import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
  Button,
  ButtonArea,
  Cell,
  CellBody,
  CellsTitle,
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

class DecorationApplicationShow extends Component {
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
      <Page className="preview" history={this.props.history} ticket_indicates={ticket ? ticket.ticket_indicates : null}>>
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
                      <p>{ticket.form_data.decoration_application_type}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>施工位置</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_floor}层{ticket.form_data.decoration_application_number}号</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>区域</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_area}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>租户/安排施工单位名称</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_tenantry_unit_name}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>联系人</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_tenantry_contact}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>联系电话</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_tenantry_tel}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>施工单位名称</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_construction_unit_name}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>联系人</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_construction_contact}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>联系电话</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_construction_tel}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>报送时间</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_license_date_time}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <PanelHeader>
                 施工方案审核
              </PanelHeader>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>施工方案图纸报送时间</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_drawing_date_time}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>同意进入后续流程</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_agree}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_agree_memo}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>工程部审批</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_repair_approved}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>工程部经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_repair_approved_manager}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>安保部审批</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_security_approved}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>安保部经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_security_approved_manager}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>运营服务部审批</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_building_approved}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>运营服务部经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_building_approved_manager}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <PanelHeader>
                 报审资料统计明细表
              </PanelHeader>
              <MediaBox type="small_appmsg">
                <Cells>
                  <CellsTitle>施工图纸一式四份</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_1_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_1_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>功能平面图</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_2_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_2_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>综合天花图</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_3_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_3_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>强电系统图</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_4_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_4_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>照明系统图</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_5_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_5_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>插座平面图</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_6_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_6_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>空调、风、水平面图</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_7_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_7_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>喷淋平面图</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_8_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_8_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>烟感平面图</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_9_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_9_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>弱电平面图</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_10_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_10_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>局部做法图</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_11_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_11_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>承重计算说明书</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_12_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_12_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>消防系统说明书</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_13_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_13_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>客户委托书</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_14_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_14_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>设计营业执照</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_15_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_15_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>设计资质证书</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_16_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_16_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>施工营业执照</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_17_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_17_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>施工资质证书</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_18_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_18_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>劳动局颁发的安全许可证</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_19_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_19_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>监理合同</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_20_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_20_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>监理执照资质</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_21_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_21_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>承建商，客户书面申请</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_22_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_22_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>北京市建筑装修改造工程消防审核表</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_23_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_23_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>装修改造方案</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_24_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_24_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>总体施工进度安排表</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_25_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_25_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>消防工程改造方案</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_26_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_26_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>消防安全协议书</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_27_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_27_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>现场消防措施及防火负责人名单</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_28_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_28_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>装修材料检测报告</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_29_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_29_memo}</p>
                    </CellFooter>
                  </Cell>
                  <CellsTitle>改造工程平面图</CellsTitle>
                  <Cell>
                    <CellBody>
                      <p>收到日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_30_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>备注</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_plan_list_30_memo}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <PanelHeader>
                 施工许可证审批
              </PanelHeader>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>报送时间</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_license_date_time}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>已附费用交纳收据复印件</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_license_receipt}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>已附《施工方案审核表》</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_license_opinion}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>运营部经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_license_responsible_manager}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>已附《北京市丰台区公安消防支队建设工程消防设计审核书》或《小规模室内装修消防安全告知书》</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_fire_receipt}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>无需附前述两项文件</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_no_need_fire_file}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>工程部经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_license_repair_manager}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>安保部经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_license_security_manager}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>项目总经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_license_chief_manager}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
              <PanelHeader>
                 施工许可证
              </PanelHeader>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>施工期限起</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_license_from_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>施工期限止</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_license_end_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>签发时间</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.decoration_application_license_issue_date}</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DecorationApplicationShow));
