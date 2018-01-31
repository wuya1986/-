import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Cells,
  CellsTitle,
  Cell,
  CellHeader,
  CellBody,
  CellFooter,
  Flex,
  FlexItem,
  Button,
  Toast,
} from 'react-weui';

import Page from '../components/page';

import {
  billRecord,
} from '../actions/ecard';

import constants from '../constants/';

//http://localhost:3000/applications/ecard_bill_record
class EcardBillRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: '本周',
    };
  }
  componentDidMount() {
    this.props.billRecord(this.state.filter);
  }
  render() {
    const {
      list, loading, error,
    } = this.props.ecard_bill_record;


    return (
      <Page title="我的账单" subTitle="您的充值以及消费记录一览" spacing>
        <div className="button-sp-area">
          <Button
            type={this.state.filter === '本周' ? 'primary' : 'default'}
            size="small"
            onClick={e => this.setState({ filter: '本周' })}
          >本周
          </Button>
          <Button
            type={this.state.filter === '本月' ? 'primary' : 'default'}
            size="small"
            onClick={e => this.setState({ filter: '本月' })}
          >本月
          </Button>
          <Button
            type={this.state.filter === '近3个月' ? 'primary' : 'default'}
            size="small"
            onClick={e => this.setState({ filter: '近3个月' })}
          >近3个月
          </Button>
        </div>
        <Toast icon="loading" show={loading}>Loading...</Toast>
        {
          error ? (<div className="alert alert-danger">Error: {error}</div>) : null
        }
        { !loading && !error ? (
            <Cells>
              {list.map((item, i) => (
                <Cell
                  key={i}
                  >
                  <CellHeader>
                    <img
                      style={{
                        borderRadius: 50, display: 'block', width: '40px', marginRight: '5px',
                      }}
                      src={`${constants.REMOTE_URL}/avatars/avatar.svg`}
                    />
                  </CellHeader>
                  <CellBody>
                    <div>{item.title}</div>
                    <div style={{ fontSize: 14, color: '#ccc' }}>{item.ymd}</div>
                  </CellBody>
                  <CellFooter>
                    {item.title === '消费' ? '-' : '+'}{item.fee}
                    <div style={{ fontSize: 14, color: '#ccc' }}>余额：{item.balance}</div>
                  </CellFooter>
                </Cell>
              ))}
            </Cells>
        ) : null}
      </Page>
    );
  }
}

const actiontateToProps = state => ({
  ecard_bill_record: state.ecard_bill_record,
});

const mapDispatchToProps = dispatch => ({
  billRecord: () => dispatch(billRecord()),
});

export default connect(actiontateToProps, mapDispatchToProps)(EcardBillRecord);
