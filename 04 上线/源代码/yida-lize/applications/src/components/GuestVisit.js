import React, { Component } from 'react';
import {
  Link,
} from 'react-router-dom';

import {
  Cells,
  CellsTitle,
  Cell,
  CellHeader,
  CellBody,
  CellFooter,
} from 'react-weui';

import Page from '../components/page';
import constants from '../constants/';

//http://localhost:3000/tickets/list/guest_visit
class GuestVisit extends Component {
  render() {
    return (
      <Page title="访客管理" subTitle="在线生成二维码，共享至来访客人，控制二维码出入有效期，物业随时查询来访人员信息" spacing>
        <Cells>
          <Cell href="/tickets/list/individual_visitor" access>
            <CellHeader>
              <img src={`${constants.REMOTE_URL}/images/individual_visitor.png`} alt="" style={{ display: 'block', width: '36px', marginRight: '5px' }} />
            </CellHeader>
            <CellBody>
              个人访客
            </CellBody>
            <CellFooter />
          </Cell>
          <Cell href="/tickets/list/batchly_visitor" access>
            <CellHeader>
              <img src={`${constants.REMOTE_URL}/images/batchly_visitor.png`} alt="" style={{ display: 'block', width: '36px', marginRight: '5px' }} />
            </CellHeader>
            <CellBody>
              批量访客
            </CellBody>
            <CellFooter />
          </Cell>
        </Cells>
      </Page>
    );
  }
}

export default GuestVisit;
