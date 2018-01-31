import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
  Panel,
  PanelBody,
  MediaBox,
  MediaBoxBody,
  MediaBoxTitle,
  MediaBoxDescription,
} from 'react-weui';
import Page from '../components/page';

class ParkingServiceRecharge extends Component {
  render() {
    return (
      <Page title="月卡续费" subTitle="停车场智能信息服务" spacing history={this.props.history}>
        <Panel>
          <PanelBody>
            <MediaBox type="appmsg" href="javascript:void(0);">
              <MediaBoxBody>
                <MediaBoxTitle>月卡续费说明</MediaBoxTitle>
                <MediaBoxDescription>
                  请在微信中搜索公众号“亿达丽泽中心”并关注，选择月卡续费菜单进行月卡续费。
                </MediaBoxDescription>
              </MediaBoxBody>
            </MediaBox>
          </PanelBody>
        </Panel>
      </Page>
    );
  }
}

const actiontateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(actiontateToProps, mapDispatchToProps)(withRouter(ParkingServiceRecharge));
