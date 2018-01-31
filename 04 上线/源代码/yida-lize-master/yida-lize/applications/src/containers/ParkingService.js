import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Panel,
  PanelHeader,
  PanelBody,
  MediaBox,
  Cells,
  Cell,
  CellBody,
  CellFooter,
  Toast,
} from 'react-weui';
import Page from '../components/page';

import {
  queryParkingInfo,
} from '../actions/parking_info';

//http://localhost:3000/applications/parking_service
class ParkingService extends Component {
  componentDidMount() {
    this.props.queryParkingInfo();
  }

  render() {
    const {
      parking_info, loading, error,
    } = this.props.parking_info;

    return (
      <Page title="停车服务" subTitle="停车场智能信息服务" spacing>
        <Toast icon="loading" show={loading}>Loading...</Toast>
        {
          error ? (<div className="alert alert-danger">Error</div>) : null
        }
        <Panel>
          <PanelHeader>
            停车场实时信息
          </PanelHeader>
          { parking_info && !loading && !error ? (
          <PanelBody>
            <MediaBox type="small_appmsg">
              <Cells>
                <Cell>
                  <CellBody>
                      车场名称
                  </CellBody>
                  <CellFooter>
                    {parking_info.parking_name}
                  </CellFooter>
                </Cell>
                <Cell>
                  <CellBody>
                      总车位
                  </CellBody>
                  <CellFooter>
                    {parking_info.space_total}
                  </CellFooter>
                </Cell>
                <Cell>
                  <CellBody>
                      空车位
                  </CellBody>
                  <CellFooter>
                    {parking_info.space_empty}
                  </CellFooter>
                </Cell>
              </Cells>
            </MediaBox>
          </PanelBody>
          ) : null
          }
        </Panel>
        <Panel>
          <PanelHeader>
            费用操作
          </PanelHeader>
          <PanelBody>
            <MediaBox type="small_appmsg">
              <Cells>
                <Cell href="/applications/parking_service_apply" access>
                  <CellBody>
                    月卡申请
                  </CellBody>
                  <CellFooter />
                </Cell>
                <Cell href="/applications/parking_service_recharge" access>
                  <CellBody>
                    月卡续费
                  </CellBody>
                  <CellFooter />
                </Cell>
                <Cell href="/applications/parking_service_my_history" access>
                  <CellBody>
                    缴费查询
                  </CellBody>
                  <CellFooter />
                </Cell>
              </Cells>
            </MediaBox>
          </PanelBody>
        </Panel>
      </Page>
    );
  }
}

const actiontateToProps = state => ({
  parking_info: state.parking_info,
});

const mapDispatchToProps = dispatch => ({
  queryParkingInfo: () => dispatch(queryParkingInfo()),
});

export default connect(actiontateToProps, mapDispatchToProps)(ParkingService);
