import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import {
  Alert,
  View,
} from 'react-native';
import Barcode from 'react-native-smart-barcode';

class Scan extends Component {
  onBarcodeRead(e) {
    this.stopScan();
    const barcode = e.nativeEvent.data.code;
    this.props.navigationScreen({
      uri: barcode,
    });
  }

  startScan(e) {
    this.barCodeRef.startScan();
  }

  stopScan(e) {
    this.barCodeRef.stopScan();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Barcode
          style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}
          ref={component => this.barCodeRef = component}
          onBarCodeRead={e => this.onBarcodeRead(e)}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  navigationScreen: item =>
    dispatch(NavigationActions.navigate({
      routeName: 'WebView',
      params: {
        ...item,
      },
    })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Scan);
