import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';

import {
  Cells,
  Cell,
  CellBody,
  CellFooter,
  Toast,
} from 'react-weui';
import Page from '../components/page';

import {
  queryParkingMyHistory,
} from '../actions/parking_info';

//http://localhost:3000/applications/parking_service_my_history
class ParkingServiceMyHistory extends Component {
  componentDidMount() {
    this.props.queryParkingMyHistory();
  }

  render() {
    const {
      list, loading, error,
    } = this.props.parking_my_history;

    return (
      <Page title="缴费履历" subTitle="停车场智能信息服务" spacing history={this.props.history}>
        <Toast icon="loading" show={loading}>Loading...</Toast>
        {
          error ? (<div className="alert alert-danger">{error}</div>) : null
        }
        <Cells>
          { list && !loading && !error ? (
              list.map((item, i) => (
                <Cell key={i}>
                  <CellBody>
                    <div>
                      {moment.unix(item.validbtime).format('YYYY-MM-DD')}
                      ~
                      {moment.unix(item.validetime).format('YYYY-MM-DD')}
                    </div>
                    <div style={{ fontSize: 14, color: '#ccc' }}>
                      {item.vpl_number},
                      {item.username},
                      {item.cardno}
                    </div>
                  </CellBody>
                  <CellFooter>
                    {item.balance}
                  </CellFooter>
                </Cell>
              ))
          ) : null
          }
        </Cells>
      </Page>
    );
  }
}

const actiontateToProps = state => ({
  parking_my_history: state.parking_my_history,
});

const mapDispatchToProps = dispatch => ({
  queryParkingMyHistory: () => dispatch(queryParkingMyHistory()),
});

export default connect(actiontateToProps, mapDispatchToProps)(withRouter(ParkingServiceMyHistory));
