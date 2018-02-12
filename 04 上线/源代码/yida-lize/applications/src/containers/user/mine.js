import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Button,
  ButtonArea,
  Cell,
  CellBody,
  CellFooter,
  Cells,
  CellsTitle,
  MediaBox,
  MediaBoxBody,
  MediaBoxDescription,
  MediaBoxHeader,
  MediaBoxTitle,
  Page,
  Panel,
  PanelBody,
  Toast,
} from 'react-weui';

import constants from '../../constants/';

class Profile extends Component {
  avatar(avatar) {
    if (avatar) {
      if (avatar.startsWith('http')) {
        return avatar;
      }
      return `${constants.FILE_URL}/${avatar}`;
    }
    return `${constants.FILE_URL}/avatars/avatar.svg`;
  }

  render() {
    const { auth: { user, loading, error } } = this.props;
    return (
      <div>
        {
          !error && user && user._id ? (
            <div>
              <Panel>
                <PanelBody>
                  <MediaBox type="appmsg" href="javascript:void(0);">
                    <MediaBoxHeader>
                      <img
                        src={this.avatar(user.avatar)}
                        style={{ width: 60, height: 60, borderRadius: '50%' }}
                      />
                    </MediaBoxHeader>
                    <MediaBoxBody>
                      <MediaBoxTitle>{user.fullname}</MediaBoxTitle>
                      <MediaBoxDescription>
                        {user.role}
                      </MediaBoxDescription>
                    </MediaBoxBody>
                  </MediaBox>
                </PanelBody>
              </Panel>
              <Cells>
                {
                  user.mobile_no ? (
                    <Cell>
                      <CellBody>
                        手机号码
                      </CellBody>
                      <CellFooter>
                        {user.mobile_no}
                      </CellFooter>
                    </Cell>
                  ) : (
                    <Cell
                      href="/applications/user-bind"
                      access
                    >
                      <CellBody>
                        绑定手机号码
                      </CellBody>
                      <CellFooter />
                    </Cell>
                  )
                }
                {
                  (user.role === '访客') ? (
                    <Cell
                      href="/applications/user-certification"
                      access
                    >
                      <CellBody>
                        申请认证{user.request_employee === '申请' ? '中...' : ''} - {user.role}
                      </CellBody>
                      <CellFooter />
                    </Cell>
                  ) : (
                    <Cell >
                      <CellBody>
                        {user.company ? user.company.company_name : ''} - {user.role}
                      </CellBody>
                    </Cell>
                  )
                }
              </Cells>
              <Cells>
                <Cell>
                  <CellBody>
                    版本
                  </CellBody>
                  <CellFooter>
                    B12.28.11
                  </CellFooter>
                </Cell>
              </Cells>
            </div>
          ) : null
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
