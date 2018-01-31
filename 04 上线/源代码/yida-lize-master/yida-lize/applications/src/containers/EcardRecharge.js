import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Button,
  Flex,
  FlexItem,
  Toast,
} from 'react-weui';

import Page from '../components/page';
import {
  recharge,
  resetRecharge,
} from '../actions/ecard';

//http://localhost:3000/applications/ecard_recharge
class EcardRecharge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toastTimer: null,
    };
  }

  componentWillUnmount() {
    this.state.toastTimer && clearTimeout(this.state.toastTimer);
  }
  recharge(yuan) {
    this.props.recharge(yuan);
  }
  delayReset() {
    this.state.toastTimer = setTimeout(() => {
      this.props.resetRecharge();
    }, 2000);
  }
  render() {
    const {
      ecard_recharge: {
        result, loading, error, just_recharged,
      },
    } = this.props;
    if (just_recharged) {
      this.delayReset();
    }
    return (
      <Page title="充值" subTitle="请确认您的用户信息无误后，以及希望充值的额度" spacing>
        <Toast icon="success-no-circle" show={just_recharged}>本功能尚未实现</Toast>
        {
          error ? (<div className="alert alert-danger">Error: {error}</div>) : null
        }
        <Flex>
          <FlexItem style={{ margin: 5 }}>
            <Button
              type="primary"
              plain
              onClick={e => this.recharge(50)}
            >50元
            </Button>
          </FlexItem>
          <FlexItem style={{ margin: 5 }}>
            <Button
              type="primary"
              plain
              onClick={e => this.recharge(100)}
            >100元
            </Button>
          </FlexItem>
          <FlexItem style={{ margin: 5 }}>
            <Button
              type="primary"
              plain
              onClick={e => this.recharge(200)}
            >200元
            </Button>
          </FlexItem>
        </Flex>
        <Flex>
          <FlexItem style={{ margin: 5 }}>
            <Button
              type="primary"
              plain
              onClick={e => this.recharge(500)}
            >500元
            </Button>
          </FlexItem>
          <FlexItem style={{ margin: 5 }}>
            <Button
              type="primary"
              plain
              onClick={e => this.recharge(1000)}
            >1000元
            </Button>
          </FlexItem>
          <FlexItem style={{ margin: 5 }}>
            <Button
              type="primary"
              plain
              onClick={e => this.recharge(2000)}
            >2000元
            </Button>
          </FlexItem>
        </Flex>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  ecard_recharge: state.ecard_recharge,
});

const mapDispatchToProps = dispatch => ({
  recharge: yuan => dispatch(recharge(yuan)),
  resetRecharge: () => dispatch(resetRecharge()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EcardRecharge);
