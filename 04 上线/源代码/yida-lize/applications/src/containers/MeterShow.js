import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
  Button,
  ButtonArea,
  Cell,
  CellBody,
  CellFooter,
  Cells,
  Panel,
  PanelBody,
  MediaBox,
  MediaBoxBody,
  MediaBoxInfo,
  MediaBoxInfoMeta,
  MediaBoxHeader,
  MediaBoxTitle,
  Toast,
} from 'react-weui';
import moment from 'moment';
import constants from '../constants/';

import Page from '../components/page';
import { fetchMeter, confirmMeterReading } from '../actions/meter';

class MeterShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meter_id: props.match.params.meter_id,
      meter_index: 0,
    };
  }

  componentDidMount() {
    this.props.fetchMeter(this.state.meter_id);
  }

  confirmMeterReading(meter_readings_id) {
    this.props.confirmMeterReading({
      meter_readings_id,
    });
  }

  render() {
    const {
      meter, loading, confirming, confirmed, error,
    } = this.props.meter;
    return (
      <Page className="preview" history={this.props.history}>
        <Toast icon="success-no-circle" show={confirmed}>确认成功</Toast>
        <Toast icon="loading" show={confirming || loading}>Loading...</Toast>
        {
          error ? (<div className="alert alert-danger">Error: {error}</div>) : null
        }
        { meter ? (
          <Panel>
            <PanelBody>
              <MediaBox type="small_appmsg">
                <Cells>
                  <Cell>
                    <CellBody>
                      <p>表号</p>
                    </CellBody>
                    <CellFooter>
                      <p>{meter.meter_number}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>电表位置</p>
                    </CellBody>
                    <CellFooter>
                      <p>{meter.meter_location}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>抄表日期</p>
                    </CellBody>
                    <CellFooter>
                      <p>{meter.meter_readings && meter.meter_readings.length > 0 ? moment(meter.meter_readings[this.state.meter_index].create_date).format('YYYY-MM-DD') : ''}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>前次表数</p>
                    </CellBody>
                    <CellFooter>
                      <p>{meter.meter_readings && meter.meter_readings.length > 0 ? meter.meter_readings[this.state.meter_index].before_number : ''}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>本次表数</p>
                    </CellBody>
                    <CellFooter>
                      <p>{meter.meter_readings && meter.meter_readings.length > 0 ? meter.meter_readings[this.state.meter_index].this_number : ''}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>倍率</p>
                    </CellBody>
                    <CellFooter>
                      <p>{meter.meter_readings && meter.meter_readings.length > 0 ? meter.meter_readings[this.state.meter_index].multiple : ''}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>本期用量</p>
                    </CellBody>
                    <CellFooter>
                      <p>{meter.meter_readings && meter.meter_readings.length > 0 ? meter.meter_readings[this.state.meter_index].this_usage : ''}</p>
                    </CellFooter>
                  </Cell>
                  <Cell>
                    <CellBody>
                      <p>租户确认</p>
                    </CellBody>
                    <CellFooter>
                      <p>{meter.meter_readings && meter.meter_readings.length > 0 ? meter.meter_readings[this.state.meter_index].company_confirm : ''}</p>
                    </CellFooter>
                  </Cell>
                </Cells>
              </MediaBox>
            </PanelBody>
          </Panel>
        ) : null
        }
        { meter && meter.meter_readings && meter.meter_readings.length > 0 ? (
          <ButtonArea>
            <Button
              disabled={meter.meter_readings[this.state.meter_index].company_confirm || loading}
              onClick={e => this.confirmMeterReading(meter.meter_readings[this.state.meter_index]._id)}
            >
                确认
            </Button>
          </ButtonArea>
        ) : null
        }

        <Panel>
          <PanelBody>
            {
              (meter && meter.meter_readings.length > 0) ? (
                meter.meter_readings.map((meter_reading, i) => (
                  <MediaBox
                    type="appmsg"
                    href="javascript:void(0);"
                    key={i}
                    onClick={() => this.setState({
                        meter_index: i,
                      }, function () {
                        this.forceUpdate();
                      })
                    }
                  >
                    <MediaBoxBody>
                      <MediaBoxTitle>
                        本次表数:{meter_reading.this_number}
                      </MediaBoxTitle>
                      <MediaBoxInfo>
                        <MediaBoxInfoMeta>抄表日期:{moment(meter_reading.create_date).format('YYYY-MM-DD')}</MediaBoxInfoMeta>
                        <MediaBoxInfoMeta>状态:{meter_reading.company_confirm ? '已确认' : '未确认'}</MediaBoxInfoMeta>
                      </MediaBoxInfo>
                    </MediaBoxBody>
                  </MediaBox>
                ))
              ) : (
                <div />
              )
            }
          </PanelBody>
        </Panel>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  meter: state.meter,
});

const mapDispatchToProps = dispatch => ({
  fetchMeter: id => dispatch(fetchMeter(id)),
  confirmMeterReading: data => dispatch(confirmMeterReading(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MeterShow));
