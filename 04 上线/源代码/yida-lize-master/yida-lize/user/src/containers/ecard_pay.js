import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Alert,
  Image,
  View,
} from 'react-native';
import styles from '../styles';

const drawerImage = require('../assets/ecard_pay.png');

class ECardPay extends Component {
  render() {
    return (
      <View style={{
flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000',
}}
      >
        <Image
          square
          style={{
          width: 250,
          height: 250,
          resizeMode: 'cover',
        }}
          source={drawerImage}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
});
const mapDispatchToProps = (dispatch, ownProps) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ECardPay);
