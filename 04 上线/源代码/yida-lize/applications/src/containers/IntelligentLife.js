import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  MediaBox,
  MediaBoxBody,
  MediaBoxDescription,
  MediaBoxHeader,
  MediaBoxTitle,
  Panel,
  PanelBody,
} from 'react-weui';

import Page from '../components/page';
import constants from '../constants/';

const apps = [{
  url: 'cn.12306://',
  appName: '12306',
  appStoreId: 'id564818797',
  playStoreId: '',
  icon: `${constants.REMOTE_URL}/images/12306.png`,
}, {
  url: 'didipasnger://nova',
  appName: '滴滴打车',
  appStoreId: 'id554499054',
  playStoreId: 'com.sdu.didi.psnger',
  icon: `${constants.REMOTE_URL}/images/didi.png`,
}, {
  url: 'eleme://',
  appName: '饿了么',
  appStoreId: 'id507161324',
  playStoreId: 'me.ele',
  icon: `${constants.REMOTE_URL}/images/ele.png`,
}];

//http://localhost:3000/applications/intelligent_life
class IntelligentLife extends Component {
  constructor(props) {
    super(props);
  }

  postMessage(app) {
    window.postMessage(JSON.stringify({
      key: 'app',
      value: app,
    }));
  }

  render() {
    return (
      <Page className="button" spacing>
        <Panel>
          <PanelBody>
            {apps.map((app, i) => (
              <MediaBox
                type="appmsg"
                href="javascript:void(0);"
                key={i}
                onClick={() => this.postMessage(app)}
              >
                <MediaBoxHeader>
                  <img
                    src={app.icon}
                  />
                </MediaBoxHeader>
                <MediaBoxBody>
                  <MediaBoxTitle>
                    {app.appName}
                  </MediaBoxTitle>
                  <MediaBoxDescription />
                </MediaBoxBody>
              </MediaBox>
            ))}
          </PanelBody>
        </Panel>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(IntelligentLife);
