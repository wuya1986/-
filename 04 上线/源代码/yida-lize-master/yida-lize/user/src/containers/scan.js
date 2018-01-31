import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Alert,
  View,
} from 'react-native';
import Barcode from 'react-native-smart-barcode';

class Scan extends Component {
  onBarcodeRead(e) {
    this.stopScan();
    const barcode = e.nativeEvent.data.code;
    Alert.alert(
      '扫码结果',
      barcode,
      [
        { text: 'Cancel', onPress: () => this.startScan(), style: 'cancel' },
        { text: 'OK', onPress: () => {} },
      ],
    );
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Scan);
