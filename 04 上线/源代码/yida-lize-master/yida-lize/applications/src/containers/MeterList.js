import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Link,
  withRouter,
} from 'react-router-dom';

import {
  Button,
  ButtonArea,
  MediaBox,
  MediaBoxBody,
  MediaBoxInfo,
  MediaBoxInfoMeta,
  MediaBoxHeader,
  MediaBoxTitle,
  Panel,
  PanelBody,
  Toast,
} from 'react-weui';
import moment from 'moment';

import Page from '../components/page';
import { fetchMeters } from '../actions/meter';
import constants from '../constants/';

class MeterList extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.fetchMeters();
  }

  openMeter(meter) {
    this.props.history.push(`/applications/meter/${meter._id}`);
  }

  render() {
    const { meters, loading, error } = this.props.meter;

    return (
      <Page className="button" spacing>
        <Toast icon="loading" show={loading}>Loading...</Toast>
        {
          error ? (<div className="alert alert-danger">Error: {error}</div>) : null
        }
        { !loading && !error ? (
          <Panel>
            <PanelBody>
              {
                (meters && meters.length > 0) ? (
                  meters.map((meter, i) => (
                    <MediaBox
                      type="appmsg"
                      href="javascript:void(0);"
                      key={i}
                      onClick={() => this.openMeter(meter)}
                    >
                      <MediaBoxHeader>
                        <img
                          src={`${constants.REMOTE_URL}/images/meter.png`}
                          style={{ width: 36, height: 36 }}
                        />
                      </MediaBoxHeader>
                      <MediaBoxBody>
                        <MediaBoxTitle>
                          {meter.meter_type}表号{meter.meter_number}
                        </MediaBoxTitle>
                        <MediaBoxInfo>
                          <MediaBoxInfoMeta>最新表数:{meter.meter_readings && meter.meter_readings.length > 0 ? meter.meter_readings[0].this_number : ''}</MediaBoxInfoMeta>
                          <MediaBoxInfoMeta>{meter.meter_readings && meter.meter_readings.length > 0 ? (meter.meter_readings[0].company_confirm ? '已确认' : '未确认') : ''}</MediaBoxInfoMeta>
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
        ) : null
        }
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  meter: state.meter,
});

const mapDispatchToProps = dispatch => ({
  fetchMeters: criteria => dispatch(fetchMeters()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MeterList));
