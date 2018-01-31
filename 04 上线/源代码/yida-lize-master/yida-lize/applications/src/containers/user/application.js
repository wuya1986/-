import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Button,
  ButtonArea,
  Cell,
  CellHeader,
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
import Svg from '../../components/Svg';

class Applications extends Component {
  render() {
    const {
      auth: {
        loading, error,
        user: {
          funcs,
        },
      },
    } = this.props;
    if (!funcs || !funcs.applications) {
      return (<div />);
    }
    return (
      <div>
        <Toast icon="loading" show={loading}>Loading...</Toast>
        { error ? (
          <div>{error}</div>
        ) : null
        }
        {
        funcs.applications.map((item, i) => (
          <div
            key={i}
          >
            <CellsTitle>{item.title}</CellsTitle>
            <Cells>
              {
            item.children ? item.children.map((leaf, j) => (
              <Cell
                key={j}
                href={leaf.uri}
                access
              >
                <CellHeader>
                  <Svg icon_id={leaf.id} />
                </CellHeader>
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
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Applications);
