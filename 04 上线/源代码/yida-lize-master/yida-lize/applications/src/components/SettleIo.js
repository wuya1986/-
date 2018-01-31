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

//http://localhost:3000/tickets/list/settle_io
class SettleIo extends Component {
  render() {
    return (
      <Page title="入驻退租" subTitle="" spacing>
        <Cells>
          <Cell href="/tickets/new/settle_in" access>
            <CellHeader>
              <img src={`${constants.REMOTE_URL}/images/settle_in.png`} alt="" style={{ display: 'block', width: '36px', marginRight: '5px' }} />
            </CellHeader>
            <CellBody>
              入驻
            </CellBody>
            <CellFooter />
          </Cell>
        </Cells>
      </Page>
    );
  }
}

export default SettleIo;
