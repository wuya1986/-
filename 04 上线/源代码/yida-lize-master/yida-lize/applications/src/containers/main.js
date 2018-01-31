import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Tab,
  TabBarItem,
} from 'react-weui';

import Main from './user/main';
import Application from './user/application';
import Wallet from './user/wallet';
import Mine from './user/mine';

import IconMain from '../assets/icon_nav_button.png';
import IconButton from '../assets/icon_nav_button.png';
import IconMsg from '../assets/icon_nav_msg.png';
import IconArticle from '../assets/icon_nav_article.png';

import { tokenLogin } from '../actions/auth';

class TabBarAutoDemo extends Component {
  componentDidMount() {
    if (!this.props.auth.user || !this.props.auth.user.mobile_no) {
      const token = localStorage.getItem('g_token');
      this.props.tokenLogin({
        token,
      });
    }
  }

  render() {
    return (
      <Tab type="tabbar">
        <TabBarItem icon={<img src={IconMain} />} label="主页">
          <Main />
        </TabBarItem>
        <TabBarItem icon={<img src={IconButton} />} label="应用">
          <Application />
        </TabBarItem>
        <TabBarItem icon={<img src={IconMsg} />} label="一卡通">
          <Wallet />
        </TabBarItem>
        <TabBarItem icon={<img src={IconArticle} />} label="我的">
          <Mine />
        </TabBarItem>
      </Tab>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});
const mapDispatchToProps = dispatch => ({
  tokenLogin: info => dispatch(tokenLogin(info)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TabBarAutoDemo);
