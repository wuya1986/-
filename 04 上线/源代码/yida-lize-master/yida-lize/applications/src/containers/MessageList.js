import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Cell,
  Cells,
  CellBody,
  CellHeader,
  CellFooter,
  MediaBox,
  MediaBoxBody,
  MediaBoxDescription,
  MediaBoxHeader,
  MediaBoxTitle,
  Panel,
  PanelBody,
  Toast,
} from 'react-weui';
import moment from 'moment';

import Page from '../components/page';

import { tokenLogin } from '../actions/auth';
import { userMessages } from '../actions/messages';
import constants from '../constants/';

//http://localhost:3000/applications/messages/list?token=JDJhJDEwJElOZ1F5VFc1MWthY1NVTjFMcVlvVk9TNWQuaGZIVi9hMUVlMWN0WUNqMll3dmI4QzFIYUsy
class MessageList extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if (!this.props.auth.user || !this.props.auth.user.mobile_no) {
      const token = localStorage.getItem('g_token');
      this.props.tokenLogin({
        token,
      });
    }

    this.props.userMessages();
  }

  linkUrl(message) {
    if (message.extensions && message.extensions.user_url) {
      return message.extensions.user_url;
    } else if (message.business_type) {
      return `/tickets/list/${message.business_type}`;
    }
    return 'javascript:;';
  }
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
    const {
      messages: {
        messages, loading, error,
      },
    } = this.props;

    return (
      <Page className="button">
        <Toast icon="loading" show={loading}>Loading...</Toast>
        {
          error ? (<div className="alert alert-danger">Error: {error}</div>) : null
        }
        { !loading && !error ? (
          <Panel>
            <PanelBody>
              <MediaBox
                type="small_appmsg"
              >
                <Cells>
                  {[...messages].map((message, i) => (
                    <Cell
                      key={i}
                      href={this.linkUrl(message)}
                      access={!!message.business_type}
                    >
                      <CellHeader>
                        {
                          message.from_admin ? (
                            <img
                              style={{ width: 36, height: 36 }}
                              src={this.avatar(message.from_admin.avatar)}
                            />
                          ) : null
                        }
                        {
                          message.from_user ? (
                            <img
                              style={{ width: 36, height: 36 }}
                              src={this.avatar(message.from_user.avatar)}
                            />
                          ) : null
                        }
                      </CellHeader>
                      <CellBody />
                      <CellFooter>
                        <p>
                          {message.from_admin ? message.from_admin.fullname : ''}
                          {message.from_user ? message.from_user.fullname : ''}
                        </p>
                        <h5 style={message.hasRead ? { fontWeight: 200 } : null}>
                          {message.content}
                        </h5>
                        <h5>
                          {moment(message.create_date).format('YYYY-MM-DD HH:mm')}
                        </h5>
                      </CellFooter>
                    </Cell>
                  ))}
                </Cells>
              </MediaBox>
            </PanelBody>
          </Panel>
        ) : null}
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  messages: state.messages,
});

const mapDispatchToProps = dispatch => ({
  tokenLogin: info => dispatch(tokenLogin(info)),
  userMessages: () => dispatch(userMessages()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
