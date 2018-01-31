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

//http://localhost:3000/tickets/list/equipment_io
class EquipmentIo extends Component {
  render() {
    return (
      <Page title="物品出入" subTitle="物品放出或者进入园区" spacing>
        <Cells>
          <Cell href="/tickets/list/goods_let/goods_letout" access>
            <CellHeader>
              <img src={`${constants.REMOTE_URL}/images/goods_letout.png`} alt="" style={{ display: 'block', width: '36px', marginRight: '5px' }} />
            </CellHeader>
            <CellBody>
              物品放出
            </CellBody>
            <CellFooter />
          </Cell>
          <Cell href="/tickets/list/goods_let/goods_letin" access>
            <CellHeader>
              <img src={`${constants.REMOTE_URL}/images/goods_letin.png`} alt="" style={{ display: 'block', width: '36px', marginRight: '5px' }} />
            </CellHeader>
            <CellBody>
              物品放入
            </CellBody>
            <CellFooter />
          </Cell>
        </Cells>
      </Page>
    );
  }
}

export default EquipmentIo;
