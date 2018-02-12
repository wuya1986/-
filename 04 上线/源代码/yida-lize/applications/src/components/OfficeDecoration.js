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

//http://localhost:3000/tickets/list/office_decoration
class OfficeDecoration extends Component {
  render() {
    return (
      <Page title="装修管理" subTitle="" spacing>
        <Cells>
          <Cell href="/tickets/list/decoration_application" access>
            <CellHeader>
              <img src={`${constants.REMOTE_URL}/images/decoration_application.png`} alt="" style={{ display: 'block', width: '36px', marginRight: '5px' }} />
            </CellHeader>
            <CellBody>
              装修申请
            </CellBody>
            <CellFooter />
          </Cell>
          <Cell href="/tickets/list/hide_acceptance_check" access>
            <CellHeader>
              <img src={`${constants.REMOTE_URL}/images/hide_acceptance_check.png`} alt="" style={{ display: 'block', width: '36px', marginRight: '5px' }} />
            </CellHeader>
            <CellBody>
              隐蔽工程验收申请
            </CellBody>
            <CellFooter />
          </Cell>
          <Cell href="/tickets/list/completed_acceptance_check" access>
            <CellHeader>
              <img src={`${constants.REMOTE_URL}/images/completed_acceptance_check.png`} alt="" style={{ display: 'block', width: '36px', marginRight: '5px' }} />
            </CellHeader>
            <CellBody>
              竣工验收
            </CellBody>
            <CellFooter />
          </Cell>
          <Cell href="/tickets/list/deposit_refund" access>
            <CellHeader>
              <img src={`${constants.REMOTE_URL}/images/deposit_refund.png`} alt="" style={{ display: 'block', width: '36px', marginRight: '5px' }} />
            </CellHeader>
            <CellBody>
              押金退还
            </CellBody>
            <CellFooter />
          </Cell>
        </Cells>
      </Page>
    );
  }
}

export default OfficeDecoration;
