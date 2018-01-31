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

class GoodsLetInShow extends Component {
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
                      <p>租户名称</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_unit_name}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>租用位置</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_floor}层{ticket.form_data.goods_let_number}号</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>申请类别</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_type}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>是否使用卸货通道</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_unloading_channel}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
            </PanelBody>
            <PanelHeader>
                装修材料类
            </PanelHeader>
            <PanelBody>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>水泥</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_cement}袋</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>木板</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_board}件</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>金属制品</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_metal}件</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
            </PanelBody>
            <PanelHeader>
                办公家具类
            </PanelHeader>
            <PanelBody>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>桌椅</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_desk}件</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>木制成品</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_wood}件</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
            </PanelBody>
            <PanelHeader>
                办公电器类
            </PanelHeader>
            <PanelBody>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>台式机</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_computer}台</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>投影仪</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_projector}台</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>电视/视频会议设备</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_tv}台</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>电扇/冷风扇</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_fan}台</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
            </PanelBody>
            <PanelHeader>
                其他类
            </PanelHeader>
            <PanelBody>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>封箱不可拆物品</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_seal}件</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>大型绿植</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_vegetation}盆</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>饮用水等</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_water}台</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
            </PanelBody>
            <PanelHeader>
                确认人
            </PanelHeader>
            <PanelBody>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>租户大件物品进/出门条确认人</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_confirm_staff}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>运营服务部（核对确认人）</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_building_staff}</p>
                    </CellFooter>
                  </Cell>
                  { ticket.form_data.goods_let_fee_confirmer ? (
                    <Cell>
                      <CellBody>
                        <p>费用确认员</p>
                      </CellBody>
                      <CellFooter>
                        <p>{ticket.form_data.goods_let_fee_confirmer}</p>
                      </CellFooter>
                    </Cell>
                  ) : null
                  }
                  { ticket.form_data.goods_let_fee_confirmer_date ? (
                    <Cell>
                      <CellBody>
                        <p>确认日期</p>
                      </CellBody>
                      <CellFooter>
                        <p>{ticket.form_data.goods_let_fee_confirmer_date}</p>
                      </CellFooter>
                    </Cell>
                  ) : null
                  }
                  { ticket.form_data.goods_let_repair_manager ? (
                    <Cell>
                      <CellBody>
                        <p>工程部经理</p>
                      </CellBody>
                      <CellFooter>
                        <p>{ticket.form_data.goods_let_repair_manager}</p>
                      </CellFooter>
                    </Cell>
                  ) : null
                  }
                  <Cell>
                    <CellBody>
                      <p>确认日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_repair_manager_date}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>安保部经理</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_security_manager}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>确认日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{ticket.form_data.goods_let_security_manager_date}</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GoodsLetInShow));
