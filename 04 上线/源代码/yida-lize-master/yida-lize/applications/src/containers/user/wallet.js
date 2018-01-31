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

class Wallet extends Component {
  render() {
    const {
      auth: {
        user,
        user: {
          funcs,
        },
      },
    } = this.props;
    if (!funcs || !funcs.wallet) {
      return (<div />);
    }
    return (
      <div>
        {
          user && user.ecard && user.role !== '访客' ? (
            <div>
              <Cells>
                <Cell>
                  <CellBody>
                    当前余额
                  </CellBody>
                  <CellFooter>
                    {user.ecard.balance}
                  </CellFooter>
                </Cell>
              </Cells>
              {
                funcs.wallet.map((item, i) => (
                  <div
                    key={i}
                  >
                    <Cells>
                      {
                        item.children ? item.children.map((leaf, j) => (
                          <Cell
                            key={j}
                            href={leaf.uri}
                            access
                          >
                            <CellBody>
                              {leaf.title}
                            </CellBody>
                            <CellFooter />
                          </Cell>
                        )) : null
                      }
                    </Cells>
                  </div>
                ))
              }
            </div>
          ) : null
        }
        <Cells>
          <Cell
            access
            href="/applications/parking_service"
          >
            <CellBody>
              停车服务
            </CellBody>
            <CellFooter />
          </Cell>
        </Cells>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
